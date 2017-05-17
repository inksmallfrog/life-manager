<template>
  <div class="modalBg" @click="$store.commit('closeModal')">
    <userModal v-if="modalName=='userModal'" :state="modalState"></userModal>
    <pictureEditor v-if="modalName=='pictureEditor'" :state="modalState"></pictureEditor>
  </div>
</template>

<script>
import UserModal from '@/components/UserModal';
import PictureEditor from '@/components/PictureEditor';
export default {
  name: 'modalControl',
  components: {
    userModal: UserModal,
    pictureEditor: PictureEditor,
  },
  computed: {
    modalName(){
      return this.$store.state.currentModal.name;
    },
    modalState(){
      return this.$store.state.currentModal.state;
    }
  }
}
</script>

<style scoped>
.modalBg{
  position: fixed;
  display: flex;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(128, 128, 128, 0.5);
}
</style>
