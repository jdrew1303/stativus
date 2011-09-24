/*globals Statechart State*//**
  This is the code for creating statecharts in your javascript files
  
  @author: Evin Grano
  @version: 0.1
  @since: 0.1
*/State={isState:!0,goToState:function(a){var b=this.statechart;if(b)b.goToState(a,this.globalConcurrentState,this.localConcurrentState);else throw"Cannot goToState cause state doesnt have a statechart"},goToHistoryState:function(a,b){var c=this.statechart;if(c)c.goToHistoryState(a,this.globalConcurrentState,this.localConcurrentState,b);else throw"Cannot goToState cause state doesnt have a statechart"},sendEvent:function(a){var b=this.statechart;if(b)b.sendEvent.apply(b,arguments);else throw"Cannot sendEvent cause state doesnt have a statechart"}},State.create=function(a){function g(){}var b,c,d,e,f;a=a||[],g.prototype=this,b=new g;for(e=0,f=a.length||0;e<f;e++){d=a[e];if(typeof d=="object")for(c in d)d.hasOwnProperty(c)&&(b[c]=d[c])}return b},Statechart={DEFAULT_TREE:"default",SUBSTATE_DELIM:"SUBSTATE:",version:"0.1",isStatechart:!0,create:function(a){function c(){}var b;return c.prototype=this,b=new c,b._all_states={},b._all_states[Statechart.DEFAULT_TREE]={},b._states_with_concurrent_substates={},b._current_subtrees={},b._current_state={},b._current_state[Statechart.DEFAULT_TREE]=null,b._goToStateLocked=!1,b._sendEventLocked=!1,b._pendingStateTransitions=[],b._pendingEvents=[],b._active_subtrees={},b},addState:function(a){var b,c,d,e,f,g,h,i=[],j,k;for(k=1,j=arguments.length;k<j;k++)i[k-1]=h=arguments[k];h=h||{},h.name=a,h.statechart=this,h.history=null,b=h.globalConcurrentState||Statechart.DEFAULT_TREE,h.globalConcurrentState=b,d=h.substatesAreConcurrent,e=h.parentState,f=this._states_with_concurrent_substates[b],d&&(c=this._states_with_concurrent_substates[b]||{},c[a]=!0,this._states_with_concurrent_substates[b]=c),e&&f&&f[e]&&(e=this._all_states[b][e],e&&(e.substates=e.substates||[],e.substates.push(a))),g=State.create(i),g.sendAction=g.sendEvent,c=this._all_states[b],c||(c={});if(c[a])throw["Trying to add state",a,"to state tree",b,"and it already exists"].join(" ");c[a]=g,this._all_states[b]=c,g._beenAdded=!0},initStates:function(a){var b,c;this._inInitialSetup=!0;if(typeof a=="string")this.goToState(a,Statechart.DEFAULT_TREE);else if(typeof a=="object")for(b in a)a.hasOwnProperty(b)&&(c=a[b],this.goToState(c,b));this._inInitialSetup=!1,this._flushPendingEvents()},goToState:function(a,b,c){var d,e=this._all_states[b],f,g,h=[],i=[],j,k,l,m,n,o,p,q,r,s,t;if(!b)throw"#goToState: invalid global parallel state";d=c?this._current_state[c]:this._current_state[b],n=e[a];if(n===d)return;if(!n)throw"#goToState: Could not find requested state: "+a;if(this._goToStateLocked){this._pendingStateTransitions.push({requestedState:a,tree:b});return}this._goToStateLocked=!0,h=this._parentStatesWithRoot(n),i=d?this._parentStatesWithRoot(d):[],k=-1;for(f=0,g=i.length;f<g;f++){l=f,k=h.indexOf(i[f]);if(k>=0)break}k<0&&(k=h.length-1),d&&d.substatesAreConcurrent&&this._fullExitFromSubstates(b,d);for(p=0;p<l;p+=1)d=i[p],s=!1,d.willExitState&&(s=d.willExitState(d.exitState)),!s&&d.exitState&&d.exitState(),d.didExitState&&d.didExitState();p=k-1,d=h[p],d&&this._cascadeEnterSubstates(d,h,p-1,b,e),this._goToStateLocked=!1,this._flushPendingStateTransitions(),this._inInitialSetup||this._flushPendingEvents()},goToHistoryState:function(a,b,c,d){var e=this._all_states[b],f,g;if(!b||!e)throw"#goToHistoryState: State requesting does not have a valid global parallel tree";f=e[a],f&&(g=f.history||f.initialSubstate);if(!g)g=a;else if(d){this.goToHistoryState(g,b,d);return}this.goToState(g,b)},currentState:function(a){var b,c,d,e,f=this._current_state,g,h,i,j,k,l;a=a||"default",g=f[a],l=this._all_states[a];if(g&&g.substatesAreConcurrent){b=[g],d=this._active_subtrees[a]||[];for(h=0,i=d.length;h<i;h++)c=d[h],j=f[c],j&&(k=l[j.parentState]),k&&b.indexOf(k)<0&&b.unshift(k),j&&b.indexOf(j)<0&&b.unshift(j)}else g&&g.isState&&(b=g);return b},sendEvent:function(a){var b=!1,c=this._current_state,d,e=[],f,g=arguments.length,h,i,j,k=Statechart.SUBSTATE_DELIM,l,m;if(g<1)return;for(h=1;h<g;h++)e[h-1]=arguments[h];if(this._inInitialSetup||this._sendEventLocked||this._goToStateLocked){this._pendingEvents.push({evt:a,args:e});return}this._sendEventLocked=!0;for(f in c){if(!c.hasOwnProperty(f))continue;b=!1,j=null,d=c[f];if(!d||f.slice(0,k.length)===k)continue;i=this._all_states[f];if(!i)continue;l=this._active_subtrees[f]||[];for(h=0,g=l.length;h<g;h++)j=l[h],m=c[j],this._cascadeEvents(a,e,m,i,j);this._cascadeEvents(a,e,d,i,null)}this._sendEventLocked=!1,this._inInitialSetup||this._flushPendingEvents()},_cascadeEvents:function(a,b,c,d,e){var f,g,h,i;e&&(g=e.split("=>"),h=g.length||0,i=g[h-1]);while(!f&&c){c[a]&&(f=c[a].apply(c,b));if(e&&i===c.name)return f;f||(c=c.parentState?d[c.parentState]:null)}},_flushPendingEvents:function(){var a,b=this._pendingEvents.shift();if(!b)return;a=b.args,a.unshift(b.evt),this.sendEvent.apply(this,a)},_flushPendingStateTransitions:function(){var a=this._pendingStateTransitions.shift(),b;if(!a)return;this.goToState(a.requestedState,a.tree)},_parentStateObject:function(a,b){if(a&&b&&this._all_states[b]&&this._all_states[b][a])return this._all_states[b][a]},_fullEnter:function(a){if(!a)return;var b=!1;a.willEnterState&&(b=a.willEnterState(cState.enterState)),!b&&a.enterState&&a.enterState(),a.didEnterState&&a.didEnterState()},_cascadeEnterSubstates:function(a,b,c,d,e){var f,g=b.length,h,i=this,j,k,l,m,n;if(typeof a=="object"&&a.length>0){a.forEach(function(a){j=d+"=>"+a,f=e[a],k=f.globalConcurrentState||Statechart.DEFAULT_TREE,n=i._active_subtrees[k]||[],n.unshift(j),i._active_subtrees[k]=n,c>-1&&b[c]===f&&(c-=1),i._cascadeEnterSubstates(f,b,c,j,e)});return}typeof a=="string"&&(a=e[a]),a&&!!a.isState&&(l=a.name,this._fullEnter(a),this._current_state[d]=a,a.localConcurrentState=d,a.substatesAreConcurrent?(d=a.globalConcurrentState||Statechart.DEFAULT_TREE,j=[Statechart.SUBSTATE_DELIM,d,l].join("=>"),a.history=a.substates,this._cascadeEnterSubstates(a.substates||[],b,c,j,e)):(f=b[c],f?(h=e[f.parentState],h&&(h.history=f.name),c-=1,c>-1&&this._cascadeEnterSubstates(f,b,c,d,e)):this._cascadeEnterSubstates(a.initialSubstate,b,c,d,e)))},_fullExitFromSubstates:function(a,b){var c,d,e,f=this;if(!a||!b||!a||!b.substates)return;d=this._all_states[a],c=this._current_state,b.substates.forEach(function(e){var g,h,i,j,k;g=[Statechart.SUBSTATE_DELIM,a,b.name,e].join("=>"),h=c[g];while(h&&h!==b){j=!1;if(!h)continue;h.substatesAreConcurrent&&f._fullExitFromSubstates(a,h),h.willExitState&&(j=h.willExitState(h.exitState)),!j&&h.exitState&&h.exitState(),h.didExitState&&h.didExitState(),i=h.parentState,h=d[i]}f._active_subtrees[a]=f._removeFromActiveTree(a,g)})},_removeFromActiveTree:function(a,b){var c=[],d=this._active_subtrees[a];return d?b?(d.forEach(function(a){a!==b&&c.push(a)}),c):d:[]},_parentStates:function(a){var b=[],c=a;b.push(c),c=this._parentStateObject(c.parentState,c.globalConcurrentState);while(c)b.push(c),c=this._parentStateObject(c.parentState,c.globalConcurrentState);return b},_parentStatesWithRoot:function(a){var b=this._parentStates(a);return b.push("root"),b}}