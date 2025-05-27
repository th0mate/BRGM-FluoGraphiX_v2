<script setup lang="ts">

</script>

<template>
  <section class="glassmorphism">

    <div class="glasmorphism-wrap">
      <div class="left">
        <img src="@/assets/img/cosmetics/brgm.svg" class="logo" alt="">
        <img src="@/assets/img/illus/download.svg" alt="">
      </div>


      <div class="right">
        <div class="presentation">
          <h2>Télécharger <span class="orange">FluoGraphiX</span></h2>
          <span class="texte-gris-simple">Téléchargez et installez maintenant FluoGraphiX sur votre appareil.<br> Bienvenue sur FluoGraphiX !</span>
        </div>

        <div class="possibility">
          <img src="@/assets/img/icons/windows.png" alt="">
          <div>
            <span class="color"></span>
            <h4>FluoGraphiX pour <span class="orange">Windows</span></h4>
            <span class="bouton boutonFonce">TÉLÉCHARGER</span>
          </div>
        </div>
        <div class="possibility">
          <img src="@/assets/img/icons/mac.png" alt="">
          <div>
            <span class="color"></span>
            <h4>FluoGraphiX pour <span class="orange">Mac</span></h4>
            <span class="bouton boutonFonce">TÉLÉCHARGER</span>
          </div>
        </div>
        <div class="possibility">
          <img src="@/assets/img/icons/android.png" alt="">
          <div>
            <span class="color"></span>
            <h4>FluoGraphiX pour <span class="orange">Andoid</span></h4>
            <span class="bouton boutonFonce">TÉLÉCHARGER</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@import "@/assets/styles/glassmorphism.css";

.glassmorphism {
  background-image: url('@/assets/img/hydro_pictures/img10.jpg');
}

.possibility {
  display: flex;
  align-items: center;
  gap: 30px;
  border: 2px solid #737373;
  border-radius: 15px;
  width: 400px;
  padding: 10px;

  img {
    height: 50px;
  }

  div {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .color {
      width: 70px;
      height: 8px;
      border-radius: 20px;
    }

    .boutonFonce {
      padding: 0 10px !important;
      font-size: 0.8em;
      font-weight: 300;
      width: fit-content;
    }
  }

  div:nth-child(1) {
    .color {
      background-color: var(--vertBRGM);
    }
  }

  div:nth-child(2) {
    .color {
      background-color: var(--roseBRGM);
    }
  }

  div:nth-child(3) {
    .color {
      background-color: var(--bleuBRGM);
    }
  }
}
</style>