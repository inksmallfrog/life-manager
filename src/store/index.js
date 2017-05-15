/*
* @Author: inksmallfrog
* @Date:   2017-05-08 07:21:45
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-05-15 09:26:57
*/

'use strict';
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

export default new Vuex.Store({
  state:{
    user: null,
    host: null,
    passages: [],
    passageCategories: [],

    lastPicturesUploaded: [],

    globalMessage: {
      content: '测试',
      type: 'info'
    },
    hasNewMessage: false,

    currentModal: {
      name: '',
      state: null
    }
  },
  mutations: {
    loggin(state, user){
      state.user = user;
    },
    quit(state){
      state.user = null;
    },

    showModal(state, modal){
      state.currentModal = modal;
    },
    closeModal(state){
      state.currentModal.name = '';
    },

    setGlobalMessage(state, message){
      state.globalMessage = message;
    },
    hasNewMessage(state, hasNewMessage){
      state.hasNewMessage = hasNewMessage;
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

    finishedPassagePictureUpload(state, res){
      state.lastPicturesUploadState = res;
    },
    pushToLastPassagePictures(state, pictures){
      state.lastPicturesUploaded = state.lastPicturesUploaded.concat(pictures);
    },
    clearLastPassagePictures(state){
      state.lastPicturesUploadState = '';
      state.lastPicturesUploaded = [];
    }
  },
  actions: {
    /*
     * 检查用户是否已登录
     * @param {commit} store
     */
    CHECK_LOGGED({commit}){
      return fetch('/users?ask=checkLogged', {
        credentials: 'include',
        method: 'GET'
      }).then((res)=>{
        return res.json();
      }).then((json)=>{
        if(!json.hasError && json.user){
          commit('loggin', json.user);
        }
      })
    },
    /*
     * 尝试用户登录
     * @param {commit} store
     *        form 用户登录表单
     */
    LOGGIN({commit, dispatch}, form){
      return fetch('/users?ask=loggin', {
        credentials: 'include',
        method: 'POST',
        body: form
      }).then((res)=>{
        return res.json();
      }).then((json)=>{
        if(!json.hasError && json.user){
          commit('loggin', json.user);
          dispatch('PUSH_MESSAGE', {
            content: '登录成功',
            type: 'info'
          })
        }
        return json;
      }).catch((err)=>{
        //网络错误
      })
    },
    /*
     * 检查注册邮箱是否已存在
     * @param {commit} store
     *        email 用户填写的邮箱
     */
    CHECK_EMAIL_CONFLICT({commit}, email){
      return fetch('/users?ask=emailexists', {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email
        })
      }).then((res)=>{
        return res.json();
      }).catch((err)=>{
        //网络错误
      })
    },
    /*
     * 执行注册操作
     * @param {commit} store
     *        form 注册表单
     */
    REGIST({commit}, form){
      fetch('/users?ask=regist', {
        credentials: 'include',
        method: 'POST',
        body: form
      }).then((res)=>{
        return res.json();
      }).then((json)=>{
        if(!json.hasError && json.user){
          commit('loggin', json.user);
        }
      }).catch((err)=>{
        //网络错误
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

    /*
     * 推送新消息
     * @param {commit} store
     *        message {
     *          content 内容
     *          type valueOf['info', 'error']
     *        }
     */
    PUSH_MESSAGE({commit}, message){
      commit('setGlobalMessage', message);
      commit('hasNewMessage', true);
      //消息停留时间
      setTimeout(()=>{
        commit('hasNewMessage', false);
      }, 5000);
    },
    quit(contex){
      //Using fetch to post quit request
      //contex.commit('quit');
    }
  }
})
