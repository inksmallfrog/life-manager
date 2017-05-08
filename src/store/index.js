/*
* @Author: inksmallfrog
* @Date:   2017-05-08 07:21:45
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-05-08 11:37:23
*/

'use strict';
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

export default new Vuex.Store({
  state:{
    user: null,

    logginEmailError: '',
    logginPsdError: '',
    registEmailError: '',
    registPsdError: ''
  },
  mutations: {
    loggin(state, user){
      state.user = user;
    },
    setLogginEmailError(state, error){
      state.logginEmailError = error;
    },
    setLogginPsdError(state, error){
      state.logginPsdError = error;
    },
    setRegistEmailError(state, error){
      state.registEmailError = error;
    },
    setRegistPsdError(state, error){
      state.registPsdError = error;
    },
    quit(state){
      state.user = null;
    }
  },
  actions: {
    CHECK_LOGGED({commit}){
      fetch('/users?ask=checkLogged', {
        method: 'GET'
      }).then((res)=>{
        return res.json();
      }).then((json)=>{
        if(!json.hasError && json.user){
          commit('loggin', json.user);
        }else{
          //do nothing
        }
      }).catch((err)=>{

      })
    },
    LOGGIN({commit}, form){
      fetch('/users?ask=loggin', {
        method: 'POST',
        body: form
      }).then((res)=>{
        return res.json();
      }).then((json)=>{
        if(!json.hasError && json.user){
          commit('loggin', json.user);
        }else{
          switch(json.param){
            case 'email':
              if(json.type == 'nomatch'){
                commit('setEmailError', '这个邮箱还没有注册');
              }
              break;
            case 'psd':
              if(json.type == 'nomatch'){
                commit('setEmailError', '密码错误');
              }
              break;
            default:
              break;
          }
        }
      }).catch((err)=>{

      })
    },
    CHECK_EMAIL_CONFLICT({commit}, email){
      fetch('/users?ask=emailexists', {
        method: 'POST',
        body: {
          email: email
        }
      }).then((res)=>{
        return res.json();
      }).then((json)=>{
        if(!json.hasError && json.exist){
          commit('setEmailError', '这个邮箱已经注册了');
        }else if(!json.hasError && !json.exist){
          commit('setEmailError', '');
        }else{

        }
      }).catch((err)=>{

      })
    },
    REGISTER({commit}, form){
      fetch('/users?ask=register', {
        method: 'POST',
        body: form
      }).then((res)=>{
        return res.json();
      }).then((json)=>{
        if(!json.hasError && json.user){
          commit('loggin', json.user);
        }else{
          //do nothing
        }
      }).catch((err)=>{

      })
    },
    quit(contex){
      //Using fetch to post quit request
      //contex.commit('quit');
    }
  }
})
