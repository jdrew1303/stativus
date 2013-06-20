/*globals Stativus DEBUG_MODE EVENTABLE COLOR_MODE EVENT_COLOR EXIT_COLOR ENTER_COLOR exports $ createNode*//*
@license
==========================================================================
Statechart -- A Micro Library
Copyright: ©2011-2013 Evin Grano All rights reserved.
          Portions ©2011-2013 Evin Grano

Permission is hereby granted, free of charge, to any person obtaining a 
copy of this software and associated documentation files (the "Software"), 
to deal in the Software without restriction, including without limitation 
the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the 
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in 
all copies or substantial portions of the Software and the Software is used 
for Good, and not Evil.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
DEALINGS IN THE SOFTWARE.

For more information about Statechart, visit http://www.itsgotwhatplanscrave.com

==========================================================================
*//**
  This is the code for creating statecharts in your javascript files
  
  @author: Evin Grano
*/// Pre-processor for eventable code
typeof EVENTABLE=="undefined"&&(EVENTABLE=!0);var creator=function(){function a(){}return a.prototype=this,new a},merge=function(a,b){var c;return a=a||{},b=b||[],b.forEach(function(b){if(typeof b=="object")for(c in b)b.hasOwnProperty(c)&&(a[c]=b[c])}),a};Stativus={DEFAULT_TREE:"default",SUBSTATE_DELIM:"SUBSTATE:",version:"0.9.4"},Stativus.State={isState:!0,_data:null,_isNone:function(a){return a===undefined||a===null},goToState:function(a,b){var c=this.statechart;c&&c.goToState(a,this.globalConcurrentState,this.localConcurrentState,b)},goToHistoryState:function(a,b){var c=this.statechart;c&&c.goToHistoryState(a,this.globalConcurrentState,this.localConcurrentState,b)},sendEvent:function(a){var b=this.statechart;b&&b.sendEvent.apply(b,arguments)},sendAction:function(a){return this.sendEvent.apply(this,arguments)},getData:function(a){if(this._isNone(a))return a;var b=this.statechart,c=this._data[a];return this._isNone(c)&&(c=b.getData(a,this.parentState,this.globalConcurrentState)),c},setData:function(a,b){if(this._isNone(a))return b;this._data[a]=b},removeData:function(a){if(this._isNone(a))return a;var b=this.statechart,c=this._data[a];this._isNone(c)?b.removeData(a,this.parentState,this.globalConcurrentState):delete this._data[a]},setHistoryState:function(a){this.history=this.substatesAreConcurrent?this.substates:a.name}},Stativus.State.create=function(a,b){var c,d,e,f,g=[a],h=a.name+"_"+a.globalConcurrentState,i=b._configs_in_waiting[h];return c=creator.call(this),c._data={},i&&g.push(i),merge(c,g)},Stativus.Statechart={create:function(a){var b=creator.call(this);return b.isStatechart=!0,b._all_states={},b._all_states[Stativus.DEFAULT_TREE]={},b._states_with_concurrent_substates={},b._current_subtrees={},b._current_state={},b._current_state[Stativus.DEFAULT_TREE]=null,b._goToStateLocked=!1,b._sendEventLocked=!1,b._pendingStateTransitions=[],b._pendingEvents=[],b._active_subtrees={},b._configs_in_waiting={},b},addState:function(a){var b,c,d=!1,e,f,g,h,i,j,k=[],l,m,n=this,o;for(m=1,l=arguments.length;m<l;m++)k[m-1]=j=arguments[m],d=d||!!j.substatesAreConcurrent,b=b||j.globalConcurrentState,f=f||j.parentState;return b=b||Stativus.DEFAULT_TREE,j=l===1?{}:merge(null,k),j.name=a,j.statechart=this,j.globalConcurrentState=b,h=this._states_with_concurrent_substates[b],d&&(c=this._states_with_concurrent_substates[b]||{},c[a]=!0,this._states_with_concurrent_substates[b]=c),f&&(e=this._all_states[b][f],e||(o=f+"_"+b,this._configs_in_waiting[o]=e=this._configs_in_waiting[o]||{}),e.substates=e.substates||[],e.substates.push(a)),i=Stativus.State.create(j,this),c=this._all_states[b]||{},c[a]=i,this._all_states[b]=c,i._beenAdded=!0,g=i.states||[],g.forEach(function(c,d){var e=[],f=!1,g;typeof c=="object"&&c.length>0?(e=e.concat(c),f=!0):typeof c=="string"?(e.push(c),f=!0):typeof c=="object"&&(e.push(c.name),e.push(c),f=!0),f&&(g=e.length-1,e[g].parentState=a,e[g].globalConcurrentState=b,n.addState.apply(n,e))}),this},initStates:function(a){var b,c;this._inInitialSetup=!0;if(typeof a=="string")this.goToState(a,Stativus.DEFAULT_TREE);else if(typeof a=="object")for(b in a)a.hasOwnProperty(b)&&(c=a[b],this.goToState(c,b));return this._inInitialSetup=!1,this._flushPendingEvents(),this},goToState:function(a,b,c,d){var e,f=this._all_states[b],g,h,i=[],j=[],k,l,m,n,o,p,q,r,s,t,u;e=c?this._current_state[c]:this._current_state[b],o=f[a];if(this._checkAllCurrentStates(o,c||b))return;this._setDataOnState(o,d);if(this._goToStateLocked){this._pendingStateTransitions.push({requestedState:a,tree:b});return}this._goToStateLocked=!0,i=this._parentStatesWithRoot(o),j=e?this._parentStatesWithRoot(e):[],l=-1;for(g=0,h=j.length;g<h;g++){m=g,l=i.indexOf(j[g]);if(l>=0)break}l<0&&(l=i.length-1),this._enterStates=i,this._enterStateMatchIndex=l,this._enterStateConcurrentTree=c,this._enterStateTree=b,this._exitStateStack=[],e&&e.substatesAreConcurrent&&this._fullExitFromSubstates(b,e);for(q=0;q<m;q+=1)e=j[q],this._exitStateStack.push(e);this._unwindExitStateStack()},goToHistoryState:function(a,b,c,d){var e=this._all_states[b],f,g;f=e[a],f&&(g=f.history||f.initialSubstate);if(!g)g=a;else if(d){this.goToHistoryState(g,b,d);return}this.goToState(g,b)},currentState:function(a){var b,c,d,e,f,g=this._current_state,h,i,j,k,l,m;a=a||"default",h=g[a],m=this._all_states[a],h&&h.isState&&(b=this._parentStates(h));if(h&&h.substatesAreConcurrent){e=this._active_subtrees[a]||[];for(i=0,j=e.length;i<j;i++)d=e[i],k=g[d],k&&(l=m[k.parentState]),l&&b.indexOf(l)<0&&b.unshift(l),k&&b.indexOf(k)<0&&b.unshift(k)}return b},sendEvent:function(a){var b=[],c=arguments.length,d;if(c<1)return;for(d=1;d<c;d++)b[d-1]=arguments[d];try{if(this._inInitialSetup||this._sendEventLocked||this._goToStateLocked){this._pendingEvents.push({evt:a,args:b});return}this._sendEventLocked=!0,this._processEvent(a,b)}catch(e){throw this._restartEvents(),e}this._restartEvents()},_setDataOnState:function(a,b){if(a&&typeof b!="undefined"&&b!==null){typeof b=="string"&&a.setData(b,b);if(typeof b=="object")for(var c in b)b.hasOwnProperty(c)&&a.setData(c,b[c])}},_processEvent:function(a,b){this._structureCrawl("_cascadeEvents",a,b)},getData:function(a,b,c){var d=this._all_states[c],e;if(!d)return null;e=d[b];if(e&&e.isState)return e.getData(a)},removeData:function(a,b,c){var d=this._all_states[c],e;if(!d)return null;e=d[b];if(e&&e.isState)return e.removeData(a)},getState:function(a,b){var c,d;return b=b||Stativus.DEFAULT_TREE,c=this._all_states[b],c?(d=c[a],d):null},_restartEvents:function(){this._sendEventLocked=!1,this._inInitialSetup||this._flushPendingEvents()},_structureCrawl:function(a,b,c){var d,e=this._current_state,f,g,h,i,j,k,l,m,n,o,p=Stativus.SUBSTATE_DELIM;for(d in e){if(!e.hasOwnProperty(d))continue;n=!1,m=null,k=e[d];if(!k||d.slice(0,p.length)===p)continue;j=this._all_states[d];if(!j)continue;l=this._active_subtrees[d]||[];for(f=0,g=l.length;f<g;f++)m=l[f],h=e[m],i=n?[!0,!0]:this[a](b,c,h,j,m),n=i[0];n||(i=this[a](b,c,k,j,null),n=i[0])}},_cascadeEvents:function(a,b,c,d,e){var f,g,h,i,j=!1;e&&(g=e.split("=>"),h=g.length||0,i=g[h-1]);while(!f&&c){if(c[a]){try{f=c[a].apply(c,b)}catch(k){}j=!0}if(e&&i===c.name)return[f,j];c=!f&&c.parentState?d[c.parentState]:null}return[f,j]},_checkAllCurrentStates:function(a,b){var c=this.currentState(b)||[];return c===a?!0:typeof c=="string"&&a===this._all_states[b][c]?!0:c.indexOf&&c.indexOf(a)>-1?!0:!1},_flushPendingEvents:function(){var a,b=this._pendingEvents.shift();if(!b)return;a=b.args,a.unshift(b.evt),this.sendEvent.apply(this,a)},_flushPendingStateTransitions:function(){var a=this._pendingStateTransitions.shift(),b;return a?(this.goToState(a.requestedState,a.tree),!0):!1},_fullEnter:function(a){var b,c=!1;if(!a)return;try{a.enterState&&a.enterState(),a.didEnterState&&a.didEnterState()}catch(d){}a.parentState&&(b=a.statechart.getState(a.parentState,a.globalConcurrentState),b.setHistoryState(a)),this._unwindEnterStateStack()},_fullExit:function(a){var b;if(!a)return;var c=!1;try{a.exitState&&a.exitState(),a.didExitState&&a.didExitState()}catch(d){}this._unwindExitStateStack()},_initiateEnterStateSequence:function(){var a,b,c,d,e,f,g;a=this._enterStates,b=this._enterStateMatchIndex,c=this._enterStateConcurrentTree,d=this._enterStateTree,e=this._all_states[d],this._enterStateStack=this._enterStateStack||[],f=b-1,g=a[f],g&&this._cascadeEnterSubstates(g,a,f-1,c||d,e),this._unwindEnterStateStack(),a=null,b=null,c=null,d=null,delete this._enterStates,delete this._enterStateMatchIndex,delete this._enterStateConcurrentTree,delete this._enterStateTree},_cascadeEnterSubstates:function(a,b,c,d,e){var f,g=b.length,h,i,j=this,k,l,m,n,o,p;if(!a)return;m=a.name,this._enterStateStack.push(a),this._current_state[d]=a,a.localConcurrentState=d;if(a.substatesAreConcurrent){d=a.globalConcurrentState||Stativus.DEFAULT_TREE,p=[Stativus.SUBSTATE_DELIM,d,m].join("=>"),i=a.substates||[],i.forEach(function(a){k=p+"=>"+a,f=e[a],l=f.globalConcurrentState||Stativus.DEFAULT_TREE,o=j._active_subtrees[l]||[],o.unshift(k),j._active_subtrees[l]=o,c>-1&&b[c]===f&&(c-=1),j._cascadeEnterSubstates(f,b,c,k,e)});return}f=b[c],f?(c>-1&&b[c]===f&&(c-=1),this._cascadeEnterSubstates(f,b,c,d,e)):(f=e[a.initialSubstate],this._cascadeEnterSubstates(f,b,c,d,e))},_fullExitFromSubstates:function(a,b){var c,d,e,f=this;if(!a||!b||!a||!b.substates)return;d=this._all_states[a],c=this._current_state,this._exitStateStack=this._exitStateStack||[],b.substates.forEach(function(e){var g,h,i,j,k;g=[Stativus.SUBSTATE_DELIM,a,b.name,e].join("=>"),h=c[g];while(h&&h!==b){j=!1;if(!h)continue;f._exitStateStack.unshift(h),h.substatesAreConcurrent&&f._fullExitFromSubstates(a,h),i=h.parentState,h=d[i]}f._active_subtrees[a]=f._removeFromActiveTree(a,g)})},_unwindExitStateStack:function(){var a,b=!1,c,d=this;this._exitStateStack=this._exitStateStack||[],a=this._exitStateStack.shift(),a?(a.willExitState&&(c=function(){var b=this._statechart;b&&b._fullExit(a)},b=a.willExitState(c)),b||this._fullExit(a)):(delete this._exitStateStack,this._initiateEnterStateSequence())},_unwindEnterStateStack:function(){var a,b=!1,c,d,e=this;this._exitStateStack=this._exitStateStack||[],a=this._enterStateStack.shift(),a?(a.willEnterState&&(c=function(){e&&e._fullEnter(a)},b=a.willEnterState(c)),b||this._fullEnter(a)):(delete this._enterStateStack,this._goToStateLocked=!1,d=this._flushPendingStateTransitions(),!d&&!this._inInitialSetup&&this._flushPendingEvents())},_removeFromActiveTree:function(a,b){var c=[],d=this._active_subtrees[a];return d?b?(d.forEach(function(a){a!==b&&c.push(a)}),c):d:[]},_parentStateObject:function(a,b){if(a&&b&&this._all_states[b])return this._all_states[b][a]},_parentStates:function(a){var b=[],c=a;b.push(c),c=this._parentStateObject(c.parentState,c.globalConcurrentState);while(c)b.push(c),c=this._parentStateObject(c.parentState,c.globalConcurrentState);return b},_parentStatesWithRoot:function(a){var b=this._parentStates(a);return b.push("root"),b}},Stativus.createStatechart=function(){return this.Statechart.create()};if(EVENTABLE){Stativus.Statechart._internalTryToPerform=function(a,b,c){var d=this,e,f;if(!a||!a.className)return;f=a.className.split(/\s+/).map(function(a){return"."+a}),a.id&&f.push("#"+a.id),f.forEach(function(a){e=(a+" "+b).replace(/^\s\s*/,"").replace(/\s\s*$/,""),d._structureCrawl("_cascadeActionHandler",e,c)})},Stativus.Statechart._cascadeActionHandler=function(a,b,c,d,e){var f,g,h,i,j=!1,k;e&&(g=e.split("=>"),h=g.length||0,i=g[h-1]);while(!f&&c){k=c.actions?c.actions[a]:null;if(k)return b.unshift(k),this.sendEvent.apply(this,b),[!0,!0];if(e&&i===c.name)return[f,j];c=!f&&c.parentState?d[c.parentState]:null}return[f,j]};var jQueryIsLoaded=!1;try{jQuery&&(jQueryIsLoaded=!0)}catch(err){jQueryIsLoaded=!1}if(jQueryIsLoaded){var findEventableNodeData=function(a){var b,c,d,e,f=$(a),g,h;return f.hasClass("eventable")&&(g=f),g||(b=f.parents(".eventable"),b&&b.length>0&&(g=b)),g&&(e=g.attr("data"),e=e?e.split("::"):[],g=g[0]),[g,e]};Stativus.Statechart.tryToPerform=function(a){if(!a)return;var b,c=[],d=findEventableNodeData(a.target);if(!d[0])return;d[1].push(a),this._internalTryToPerform(d[0],a.type,d[1])}}else Stativus.Statechart.tryToPerform=function(a){if(!a)return;var b=[],c=arguments.length,d,e;if(c<2)return;for(d=2;d<c;d++)b[d-2]=arguments[d];b.push(a),this._internalTryToPerform(a.target,a.type,b)}}typeof window!="undefined"?window.Stativus=Stativus:typeof exports!="undefined"&&(module.exports=Stativus);