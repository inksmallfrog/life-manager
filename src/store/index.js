/*
* @Author: inksmallfrog
* @Date:   2017-05-08 07:21:45
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-05-12 13:00:01
*/

'use strict';
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

export default new Vuex.Store({
  state:{
    user: null,
    passages: [],
    passageCategories: [],
    lastPicturesUploaded: [],
    globalMessage: '',


    logginEmailError: '',
    logginPsdError: '',
    registEmailError: '',
    registPsdError: ''
  },
  mutations: {
    loggin(state, user){
      state.user = user;
    },
    getPassageCategories(state, categories){
      state.passageCategories = categories;
    },
    getPassages(state, passages){
      state.passages = passages;
    },
    deletePassage(state, id){
      let index = state.passages.findIndex(passage=>passage.id == id);
      state.passages.splice(index, 1);
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
    finishedPassagePictureUpload(state, res){
      state.lastPicturesUploadState = res;
    },
    pushToLastPassagePictures(state, pictures){
      state.lastPicturesUploaded = state.lastPicturesUploaded.concat(pictures);
    },
    clearLastPassagePictures(state){
      state.lastPicturesUploadState = '';
      state.lastPicturesUploaded = [];
    },
    quit(state){
      state.user = null;
    }
  },
  actions: {
    CHECK_LOGGED({commit}){
      fetch('/users?ask=checkLogged', {
        credentials: 'include',
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
        credentials: 'include',
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
                commit('setLogginEmailError', '这个邮箱还没有注册');
              }
              break;
            case 'psd':
              if(json.type == 'nomatch'){
                commit('setLogginPsdError', '密码错误');
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
        credentials: 'include',
        method: 'POST',
        body: {
          email: email
        }
      }).then((res)=>{
        return res.json();
      }).then((json)=>{
        if(!json.hasError && json.exist){
          commit('setRegistEmailError', '这个邮箱已经注册了');
        }else if(!json.hasError && !json.exist){
          commit('setRegistEmailError', '');
        }else{

        }
      }).catch((err)=>{

      })
    },
    REGISTER({commit}, form){
      fetch('/users?ask=regist', {
        credentials: 'include',
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
    FETCH_PASSAGECATEGORIES({commit}, userId){
      fetch(`/categories?type=passage&userId=${userId}`, {
        credentials: 'include',
        method: 'GET',
      }).then((res)=>{
        return res.json();
      }).then((json)=>{
        if(!json.hasError && json.categories){
          commit('getPassageCategories', json.categories);
        }else{
          //do nothing
        }
      }).catch((err)=>{

      })
    },
    FETCH_PASSAGES({commit}, userId){
      fetch(`/passages?userId=${userId}`, {
        credentials: 'include',
        method: 'GET',
      }).then((res)=>{
        return res.json();
      }).then((json)=>{
        if(!json.hasError && json.passages){
          commit('getPassages', json.passages);
        }else{
          //do nothing
        }
      }).catch((err)=>{

      })
    },
    /*
     * 上传文章中的图片
     * @param {commit} store自身
     *        formdata 包含图片数据的表单数据，
     *                 图片的name为pictures
     * @return Array<{src}> | String
     */
    UPLOAD_PASSAGE_PICTURE({commit}, formdata){
      return fetch('/pictures', {
        credentials: 'include',
        method: 'POST',
        body: formdata
      }).then((res)=>{
        return res.json();
      }).then((json)=>{
        if(!json.hasError && json.pictures){
          commit('pushToLastPassagePictures', json.pictures);
          return json.pictures;
        }else{
          return json.info;
        }
      }).catch((err)=>{
        return '网络错误';
      })
    },
    /*
     * 将文章保存为草稿
     * @param {commit} store自身
     *        passage 文章内容
     *          {
     *            id
     *            title: 标题
     *            category: 分类
     *            content: 内容
     *          }
     */
    SAVE_TO_SCRIPT({commit}, passage){
      return fetch('/passages?type=script', {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(passage)
      }).then((res)=>{
        return res.json();
      }).then((json)=>{
        if(!json.hasError && json.passage){
          commit('pushToLastPassagePictures', json.pictures);
          return json.passage.id;
        }else{
          return json.info;
        }
      }).catch((err)=>{
        return '网络错误';
      })
    },
    /*
     * 发表文章
     * @param {commit} store自身
     *        passage 文章内容
     *          {
     *            id
     *            title: 标题
     *            category: 分类
     *            content: 内容
     *          }
     */
    PUBLISH({commit}, passage){
      return fetch('/passages?type=published', {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(passage)
      }).then((res)=>{
        return res.json();
      }).then((json)=>{
        if(!json.hasError && json.passage){
          commit('pushToLastPassagePictures', json.pictures);
          return json.passage.id;
        }else{
          return json.info;
        }
      }).catch((err)=>{
        return '网络错误';
      })
    },
    /*
     * 删除文章
     * @param {commit} store自身
     *        id 文章id
     */
    DELETE_PASSAGE({commit}, id){
      fetch(`/passages/${id}`, {
        credentials: 'include',
        method: 'DELETE'
      }).then((res)=>{

      });
      commit('deletePassage', id);
    },
    quit(contex){
      //Using fetch to post quit request
      //contex.commit('quit');
    }
  }
})
