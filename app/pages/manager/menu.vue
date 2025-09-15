<script setup lang="js">
  import Swal from 'sweetalert2'

  const loading = ref(false);

  useHead({
    title: "เมนูอาหาร - MyPOS"
  });

  const isAddStockItemModalActive = ref(false);
  const isUpdateStockItemModalActive = ref(false);
  const isDeleteStockItemModalActive = ref(false);

  const addStockItemPayload = ref({
    title: null,
    detail: null,
    category: null,
    amount: 1,
    unit: null,
    price: 0
  });

  async function addStockItem() {
    // Check empty input payload value
    if (addStockItemPayload.value.title == null || addStockItemPayload.value.detail == null || addStockItemPayload.value.category == null || addStockItemPayload.value.unit == null) {
      // Active sweet alert. Error some input is empty value
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "error",
        title: "โปรดกรอกข้อมูลให้ครบ"
      });

      console.error("Can't submit empty input!");
      return "Can't submit empty input!";
    }

    // Begin add stock item
    console.log("adding stock item");
    loading.value = true;

    await new Promise(resolve => setTimeout(resolve, 1000)); 

    // Active sweet alert. Add stock item success
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: "success",
      title: "เพิ่มรายการสินค้าคงคลังสำเร็จ"
    });

    isAddStockItemModalActive.value = false;
    loading.value = false;

    // Clear payload after add item success
    addStockItemPayload.value = {
      title: null,
      detail: null,
      category: null,
      amount: 1,
      unit: null,
      price: 0
    };
    imagePreview.value = "";
    fileInput.value = null;

    console.log("add stock item succesed");
  }

  const imagePreview = ref('');
  const fileInput = ref(null);

  // Watch for file changes
  watch(() => addStockItemPayload.value.image, (newFile) => {
    if (newFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.value = e.target.result;
      }
      reader.readAsDataURL(newFile);
    } else {
      imagePreview.value = '';
    }
  })

  // Validate file type
  function validateFile(file) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    return allowedTypes.includes(file.type);
  }

  // Handle file selection
  function onFileSelect(files) {
    if (files && files.length > 0) {
      const file = files[0]
      if (validateFile(file)) {
        addStockItemPayload.value.image = file;
      } else {
        // Active sweet alert. Error some input is empty value
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "error",
          title: "กรุณาเลือกไฟล์รูปภาพเท่านั้น (JPG, PNG, GIF, WebP)"
        });
        // Reset file input
        addStockItemPayload.value.image = null;
      }
    }
  }

  // Remove image
  function removeImage() {
    addStockItemPayload.value.image = null
    imagePreview.value = ''
  }

  async function updateStockItem() {
    // Check empty input payload value
    if (addStockItemPayload.value.title == null || addStockItemPayload.value.detail == null || addStockItemPayload.value.category == null || addStockItemPayload.value.unit == null) {
      // Active sweet alert. Error some input is empty value
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "error",
        title: "โปรดกรอกข้อมูลให้ครบ"
      });

      console.error("Can't submit empty input!");
      return "Can't submit empty input!";
    }

    // Begin add stock item
    console.log("updating stock item");
    loading.value = true;

    await new Promise(resolve => setTimeout(resolve, 1000)); 

    // Active sweet alert. Add stock item success
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: "success",
      title: "อัพเดตรายการสินค้าคงคลังสำเร็จ"
    });

    isUpdateStockItemModalActive.value = false;
    loading.value = false;

    // Clear payload after add item success
    addStockItemPayload.value = {
      title: null,
      detail: null,
      category: null,
      amount: 1,
      unit: null,
      price: 0
    };
    imagePreview.value = "";
    fileInput.value = null;

    console.log("update stock item success");
  }

  // Delete stock item
  async function deleteStockItem() {
    // Begin delete stock item
    console.log("updating stock item");
    loading.value = true;

    await new Promise(resolve => setTimeout(resolve, 1000)); 

    // Active sweet alert. Delete stock item success
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: "success",
      title: "ลบรายการสินค้าคงคลังสำเร็จ"
    });

    isDeleteStockItemModalActive.value = false;
    loading.value = false;

    console.log("update stock item success");
  }

  // Add food option
  const isMainOptionActiveArray = ref([]);
  async function addMainOption() {
    console.log("Adding main option");
    isMainOptionActiveArray.value.push({
      type: 1,
      mainTitle: null,
      subTitle: [{
        title: null
      }]
    });

    console.log(isMainOptionActiveArray.value);
  }

  async function addSubOption(mainOptionIndex) {
    console.log("Adding sub option");
    isMainOptionActiveArray.value[mainOptionIndex].subTitle.push({title: null});

    console.log(isMainOptionActiveArray.value);
  }

  async function addMaterail() {

  }
</script>

<template>
  <v-app>
    <!-- App Bar -->
    <NavBar></NavBar>

    <!-- Main Content -->
    <v-main>
      <v-container>
        <div class="flex justify-between gap-3 mb-3 py-3 border-b border-[#121212]">
          <div class="flex justify-start gap-2">
            <v-btn @click="isAddStockItemModalActive = true">เลือกเมนูใหม่</v-btn>
            <v-btn @click="isAddStockItemModalActive = true">เพิ่มหมวดหมู่</v-btn>
          </div>

          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" prepend-icon="mdi-filter">เลือกหมวดหมู่</v-btn>
            </template>
            <v-list>
              <v-list-item>
                <v-list-item-title><v-btn variant="text" class="w-full">เนื้อสัตว์</v-btn></v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title><v-btn variant="text" class="w-full">เครื่องดื่ม</v-btn></v-list-item-title>
                <v-list-item-title><v-btn variant="text" class="w-full">ผัก</v-btn></v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <div>
          <div class="w-full border-b border-[#121212] py-3">
            <div class="flex flex-wrap">
              <div class="w-[120px] h-[120px] flex-shrink-0 mb-3 lg:mb-0">
                <img src="https://www.palangkaset.com/wp-content/uploads/2017/05/%E0%B9%80%E0%B8%A5%E0%B8%B5%E0%B9%89%E0%B8%A2%E0%B8%87%E0%B8%AB%E0%B8%A1%E0%B8%B9-%E0%B9%83%E0%B8%99%E0%B8%AA%E0%B8%A0%E0%B8%B2%E0%B8%9E%E0%B8%AD%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A8%E0%B9%80%E0%B8%9B%E0%B8%A5%E0%B8%B5%E0%B9%88%E0%B8%A2%E0%B8%99%E0%B9%81%E0%B8%9B%E0%B8%A5%E0%B8%87-%E0%B8%AB%E0%B8%99%E0%B9%89%E0%B8%B2%E0%B8%A3%E0%B9%89%E0%B8%AD%E0%B8%99-%E0%B8%AB%E0%B8%99%E0%B9%89%E0%B8%B2%E0%B8%AB%E0%B8%99%E0%B8%B2%E0%B8%A7.jpg" alt="เนื้อหมู" class="w-full h-full object-cover" />
              </div>
              <div class="w-full lg:w-[600px] px-4 mb-3">
                <p class="bg-[#0ca118]/20 rounded px-3 w-fit">#ปกติ</p>
                <h1 class="text-xl font-bold">เนื้อหมู</h1>
                <p class="text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus, nemo voluptates aliquam reiciendis nihil suscipit magnam dolore nulla adipisci at dolores quod vero sint in corporis assumenda. Sequi, beatae quo.</p>
                <p>หมวดหมู่: เนื้อสัตว์</p>
                <p>คงเหลือ: 20 กก.</p>
                <p class="font-bold text-lg">200 บาท</p>
              </div>
            </div>
            <div class="flex gap-2">
              <v-btn color="yellow-darken-1" @click="isUpdateStockItemModalActive = true">แก้ไข</v-btn>
              <v-dialog max-width="500">
                <template v-slot:activator="{ props: activatorProps }">
                  <v-btn v-bind="activatorProps" color="red-accent-4">ลบ</v-btn>
                </template>

                <template v-slot:default="{ isActive }">
                  <v-card title="ยืนยันการทำรายการ">
                    <v-card-text>
                      ยืนยันการทำรายการนี้หรือไม่
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn @click="deleteStockItem(); isActive.value = false" class="text-primary">ตกลง</v-btn>
                      <v-btn @click="isActive.value = false"><span class="text-red-accent-4">ยกเลิก</span></v-btn>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>
            </div>
          </div>
        </div>
      </v-container>
    </v-main>

    <!-- Overlay Loading -->
    <v-overlay v-model="loading" class="d-flex align-center justify-center" persistent>
      <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
    </v-overlay>
  </v-app>

  <!-- Add item modal -->
  <Modal :show="isAddStockItemModalActive" title="เพิ่มรายการสินค้าคงคลัง">
  <!-- <Modal :show="true" title="เพิ่มรายการเมนูในร้าน"> -->
    <v-form>
      <div>
        <v-file-input v-model="addStockItemPayload.image" label="รูปภาพ" variant="outlined" accept="image/*" @update:model-value="onFileSelect" prepend-icon="mdi-camera" show-size required></v-file-input>
        <div v-if="imagePreview" class="mb-4">
          <v-card class="mx-auto" max-width="300">
            <v-img :src="imagePreview" height="200" cover></v-img>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" variant="text" @click="removeImage" size="small">
                ลบรูปภาพ
              </v-btn>
            </v-card-actions>
          </v-card>
        </div>
        <v-text-field label="ชื่อเมนู" color="primary" variant="outlined" required></v-text-field>
        <v-textarea label="รายละเอียดเมนู" color="primary" variant="outlined" required></v-textarea>
        <v-number-input label="ราคา (บาท)" color="primary" controlVariant="split" variant="outlined" required></v-number-input>
        <v-select label="หมวดหมู่อาหาร / เครื่องดิ่ม" color="primary" :items="['อาหารจานหลัก', 'ของกินเล่น', 'เครื่องดื่ม']" variant="outlined" required></v-select>

        <div v-for="(item, index) in isMainOptionActiveArray" class="border pa-3 mb-6">
          <v-select v-model="item.type" label="เลือกชนิดตัวเลือก" :items="[{title: 'เลือกได้หลายอย่าง', value: 1}, {title: 'เลือกได้อย่างเดียว', value: 2}]" item-title="title" item-value="value" variant="outlined" color="primary"></v-select>
          <v-text-field v-model="item.mainTitle" :label="'ชื่อหัวข้อตัวเลือกที่ ' + (index + 1)" color="primary" variant="outlined"></v-text-field>
          <div v-for="(subTitleItem, subTitleIndex) in item.subTitle" no-gutters>
            <v-text-field v-model="subTitleItem.title" :label="'ชื่อตัวเลือกที่ ' + (subTitleIndex + 1)" color="primary" variant="outlined" density="compact" class="pa-0 me-2"></v-text-field>
          </div>
          <v-btn v-btn variant="outlined" class="w-full" @click="addSubOption(index)">เพิ่มตัวเลือก</v-btn>
        </div>
        <v-btn variant="outlined" color="primary" class="w-full mb-6" @click="addMainOption">+ เพิ่มหัวข้อตัวเลือก</v-btn>
        <!-- <v-btn variant="outlined" color="primary" class="w-full mb-6" @click="addMaterail">+ วัตถุดิบ</v-btn> -->
      </div>

      <div class="flex justify-end gap-3">
        <v-dialog max-width="500">
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps" color="primary">เพิ่มรายการ</v-btn>
          </template>

          <template v-slot:default="{ isActive }">
            <v-card title="ยืนยันการทำรายการ">
              <v-card-text>
                ยืนยันการทำรายการนี้หรือไม่
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="addStockItem(); isActive.value = false" class="text-primary">ตกลง</v-btn>
                <v-btn @click="isActive.value = false" class="text-red-accent-4">ยกเลิก</v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
        <v-btn @click="isAddStockItemModalActive = false">ปิดหน้าต่าง</v-btn>
      </div>
    </v-form>
  </Modal>

  <!-- Edit stock item -->
  <Modal :show="isUpdateStockItemModalActive" title="แก้ไขรายการ">
    <v-form @submit.prevent="updateStockItem">
      <div>
        <v-text-field v-model="addStockItemPayload.title" label="ชื่อรายการ" color="primary" variant="outlined" required></v-text-field>
        <v-textarea v-model="addStockItemPayload.detail" label="รายละเอียด" color="primary" variant="outlined" required></v-textarea>
        <v-select v-model="addStockItemPayload.category" label="หมวดหมู่" color="primary" :items="['เนื้อสัตว์', 'เครื่องดื่ม', 'ผัก']" variant="outlined" required></v-select>
        <v-number-input v-model="addStockItemPayload.amount" label="จำนวน" color="primary" controlVariant="split" variant="outlined" required></v-number-input>
        <v-select v-model="addStockItemPayload.unit" label="หน่วย" color="primary" :items="['กิโลกรัม', 'ลิตร', 'ขวด', 'ถุง']" variant="outlined" required></v-select>
        <v-number-input v-model="addStockItemPayload.price" label="ราคา" color="primary" controlVariant="split" variant="outlined" required></v-number-input>
        <!-- File Input Section -->
        <v-file-input v-model="addStockItemPayload.image" label="รูปภาพ" variant="outlined" accept="image/*" @update:model-value="onFileSelect" prepend-icon="mdi-camera" show-size required></v-file-input>
        <!-- Image Preview -->
        <div v-if="imagePreview" class="mb-4">
          <v-card class="mx-auto" max-width="300">
            <v-img :src="imagePreview" height="200" cover></v-img>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" variant="text" @click="removeImage" size="small">
                ลบรูปภาพ
              </v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </div>

      <div class="flex justify-end gap-3">
        <v-dialog max-width="500">
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps" color="primary">อัพเดตรายการ</v-btn>
          </template>

          <template v-slot:default="{ isActive }">
            <v-card title="ยืนยันการทำรายการ">
              <v-card-text>
                ยืนยันการทำรายการนี้หรือไม่
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="updateStockItem(); isActive.value = false" class="text-primary">ตกลง</v-btn>
                <v-btn @click="isActive.value = false" class="text-red-accent-4">ยกเลิก</v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
        <v-btn @click="isUpdateStockItemModalActive = false">ปิดหน้าต่าง</v-btn>
      </div>
    </v-form>
  </Modal>
</template>
