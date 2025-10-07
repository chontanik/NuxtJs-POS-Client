<<script setup lang="js">
  import Swal from 'sweetalert2'

  const loading = ref(false);

  useHead({
    title: "เมนูอาหาร - MyPOS"
  });

  const isAddMenuItemActive = ref(false);
  const isUpdateMenuItemModalActive = ref(false);
  // const isDeleteStockItemModalActive = ref(false);

  // Get stock category
  const stockCategoryList = ref([]);
  async function getStockCategoryList() {
    const category = JSON.parse(localStorage.getItem("category")) || [];
    const categoryFillter = category.filter(item => item.categoryOf.includes("อาหาร"));

    for (var i = 0; i < categoryFillter.length; i++) {
      stockCategoryList.value.push(categoryFillter[i]['title']);
    }
  }
  onMounted(async () => {
    await getStockCategoryList();
  });

  // Get stock item list
  const stockList = ref([]);
  async function getMaterail() {
    const stock = JSON.parse(localStorage.getItem("stockList")) || [];

    for (var i = 0; i < stock.length; i++) {
      stockList.value.push(stock[i]['title']);
    }
  }
  onMounted(async () => {
    console.log(stockList.value);
    await getMaterail();
  });

  // Get menu list
  const menuList = ref([]);
  async function getMenuList() {
    const menu = JSON.parse(localStorage.getItem("menuList")) || [];
    menuList.value = menu;
  }
  onMounted(async () => {
    await getMenuList();
  });

  // Add food option
  const menuOptionData = ref([]);
  async function addMainOption() {
    console.log("Adding main option");
    menuOptionData.value.push({
      type: 1,
      mainTitle: null,
      subTitle: [{
        title: null,
        price: 0
      }]
    });

    console.log(menuOptionData.value);
  }
  async function addSubOption(mainOptionIndex) {
    console.log("Adding sub option");
    menuOptionData.value[mainOptionIndex].subTitle.push({title: null});

    console.log(menuOptionData.value);
  }

  // Add food materail
  const materailData = ref([]);
  async function addMaterail() {
    materailData.value.push({
      _id: null,
      amount: null,
      unit: 'กิโลกรัม'
    });
  }

  // Add menu item list
  const addMenuPayload = ref({
    status: 1,
    img: "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg",
    image: null,
    title: null,
    detail: null,
    price: null,
    category: null,
    option: menuOptionData.value,
    materail: materailData.value
  });
  async function onAddMenuSubmit() {
    loading.value = true;
    await new Promise(resolve => setTimeout(resolve, 1000));

    const menuList = JSON.parse(localStorage.getItem("menuList")) || [];
    menuList.push(addMenuPayload.value);
    localStorage.setItem("menuList", JSON.stringify(menuList));
    console.log(addMenuPayload.value);

    Swal.fire({
      title: 'เพิ่มเมนูอาหารสำเร็จ',
      icon: 'success',
      confirmButtonText: 'ตกลง',
      confirmButtonColor: '#4CAF50',
      cancelButtonColor: '#f44336',
      customClass: {
        confirmButton: 'bg-primary text-white'
      },
    });

    // Clear payload after sunmit success
    addMenuPayload.value = {
      status: 1,
      img: "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg",
      image: null,
      title: null,
      detail: null,
      price: null,
      category: null,
      option: [],
      materail: []
    }

    loading.value = false;
    isAddMenuItemActive.value = false;
    
    await getMenuList();
  }

  // Update menu item
  const updateMenuPayload = ref({
    status: 1,
    img: "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg",
    image: null,
    title: null,
    detail: null,
    price: null,
    category: null,
    option: [],
    materail: []
  });
  async function activeUpdateMenuItemModal(_id) {
    console.log(_id);
    isUpdateMenuItemModalActive.value = true;

    const menu = JSON.parse(localStorage.getItem("menuList")) || [];
    console.log(menu[_id]);

    updateMenuPayload.value = {
      _id: _id,
      status: menu[_id]['status'],
      img: menu[_id]['img'],
      image: null,
      title: menu[_id]['title'],
      detail: menu[_id]['detail'],
      price: menu[_id]['price'],
      category: menu[_id]['category'],
      option: menu[_id]['option'],
      materail: menu[_id]['materail']
    }
  }
  async function onUpdateMenuItemSubmit(_id) {
    loading.value = true;

    await new Promise(resolve => setTimeout(resolve, 1000));

    const menu = JSON.parse(localStorage.getItem("menuList")) || [];
    console.log(menu[_id]);
    menu[_id] = updateMenuPayload.value;
    localStorage.setItem("menuList", JSON.stringify(menu));
  
    loading.value = false;
    isUpdateMenuItemModalActive.value = false;

    Swal.fire({
      title: 'แก้ไขเมนูอาหารสำเร็จสำเร็จ',
      icon: 'success',
      confirmButtonText: 'ตกลง',
      confirmButtonColor: '#4CAF50',
      cancelButtonColor: '#f44336',
      customClass: {
        confirmButton: 'bg-primary text-white'
      },
    });
    await getMenuList();
  }

  // Delete menu item
  async function onDeleteMenuItem(_id) {
    loading.value = true;

    console.log(_id);
    const menu = JSON.parse(localStorage.getItem("menuList")) || [];
    const index = menu.findIndex(item => item._id === _id);
    if (index !== -1) {
      menu.splice(index, 1);
    }
    console.log(menu);
    localStorage.setItem("menuList", JSON.stringify(menu));

    loading.value = false;
    isUpdateMenuItemModalActive.value = false;

    Swal.fire({
      title: 'ลบสินค้าในคลังสำเร็จ',
      icon: 'success',
      confirmButtonText: 'ตกลง',
      confirmButtonColor: '#4CAF50',
      cancelButtonColor: '#f44336',
      customClass: {
        confirmButton: 'bg-primary text-white'
      },
    });

    await getMenuList();
  }

  // Upload image and preview image
  const imagePreview = ref('');
  const fileInput = ref(null);
  // Watch for file changes
  watch(() => addMenuPayload.value.image, (newFile) => {
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
        addMenuPayload.value.image = file;
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
        addMenuPayload.value.image = null;
      }
    }
  }
  // Remove image
  function removeImage() {
    addMenuPayload.value.image = null
    imagePreview.value = ''
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
            <v-btn @click="isAddMenuItemActive = true">เลือกเมนูใหม่</v-btn>
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
          <v-hover v-for="(menuItem, menuIndex) in menuList">
            <template v-slot:default="{ isHovering, props }">
              <v-card elevation="0" v-bind="props" :color="isHovering ? 'blue-lighten-5' : ''" class="w-full border-b border-[#121212] rounded-0 pa-3" @click="activeUpdateMenuItemModal(menuIndex)">
                <div class="flex flex-wrap cursor-pointer">
                  <div class="w-[120px] h-[120px] flex-shrink-0 mb-3 lg:mb-0">
                    <img src="https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg" alt="เนื้อหมู" class="w-full h-full object-cover rounded" />
                  </div>
                  <div class="ml-3">
                    <p class="bg-green-200 rounded w-fit px-3">#สถานะ</p>
                    <p class="text-lg font-bold">{{ menuItem.title }}</p>
                    <p>{{ menuItem.detail }}</p>
                    <p>หมวดหมู่: 
                      <span>{{ menuItem.category }}</span>
                    </p>
                    <p><span class="font-bold text-lg">{{ Number(menuItem.price).toLocaleString("TH-th") }}</span> บาท</p>
                  </div>
                </div>
              </v-card>
            </template>
          </v-hover>
        </div>
      </v-container>
    </v-main>

    <!-- Overlay Loading -->
    <v-overlay v-model="loading" class="d-flex align-center justify-center" persistent>
      <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
    </v-overlay>
  </v-app>

  <!-- Add item modal -->
  <Modal :show="isAddMenuItemActive" title="เพิ่มรายการเมนูในร้าน">
    <div>
      <v-file-input v-model="addMenuPayload.image" label="รูปภาพ" variant="outlined" accept="image/*" @update:model-value="onFileSelect" prepend-icon="mdi-camera" show-size></v-file-input>
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
      <v-text-field v-model="addMenuPayload.title" label="ชื่อเมนู" color="primary" variant="outlined" required></v-text-field>
      <v-textarea v-model="addMenuPayload.detail" label="รายละเอียดเมนู" color="primary" variant="outlined" required></v-textarea>
      <v-number-input v-model="addMenuPayload.price" label="ราคา (บาท)" color="primary" controlVariant="split" variant="outlined" required></v-number-input>
      <v-select v-model="addMenuPayload.category" label="หมวดหมู่อาหาร / เครื่องดิ่ม" color="primary" :items="stockCategoryList" variant="outlined" required></v-select>

      <!-- Option border -->
      <div v-for="(item, index) in menuOptionData" class="border pa-3 mb-6">
        <v-select v-model="item.type" label="เลือกชนิดตัวเลือก" :items="[{title: 'เลือกได้หลายอย่าง', value: 1}, {title: 'เลือกได้อย่างเดียว', value: 2}]" item-title="title" item-value="value" variant="outlined" color="primary"></v-select>
        <v-text-field v-model="item.mainTitle" :label="'ชื่อหัวข้อตัวเลือกที่ ' + (index + 1)" color="primary" variant="outlined"></v-text-field>
        <div v-for="(subTitleItem, subTitleIndex) in item.subTitle" no-gutters>
          <v-row>
            <v-col cols="6">
              <v-text-field v-model="subTitleItem.title" :label="'ชื่อตัวเลือกที่ ' + (subTitleIndex + 1)" color="primary" variant="outlined" density="compact" class="pa-0 me-2"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-number-input v-model="subTitleItem.price" controlVariant="split" label="บวกราคาเพิ่ม" variant="outlined" color="primary" density="compact"></v-number-input>
            </v-col>
          </v-row>
        </div>
        <v-btn v-btn variant="outlined" class="w-full" @click="addSubOption(index)">เพิ่มตัวเลือก</v-btn>
      </div>
      <v-btn variant="outlined" color="primary" class="w-full mb-6" @click="addMainOption">+ เพิ่มหัวข้อตัวเลือก</v-btn>

      <!-- Material border -->
      <div v-for="(item, index) in materailData" class="border pa-3 mb-6">
        <!-- <v-select v-model="item._id" label="เลือกวัตถุดิบ" :items="[{title: 'เลือกได้หลายอย่าง', value: 1}, {title: 'เลือกได้อย่างเดียว', value: 2}]" item-title="title" item-value="value" variant="outlined" color="primary"></v-select> -->
        <v-select v-model="item._id" label="เลือกวัตถุดิบ" :items="stockList" variant="outlined" color="primary"></v-select>
        <v-number-input v-model="item.amount" controlVariant="split" label="ปริมาณ" color="primary" variant="outlined"></v-number-input>
        <v-select v-model="item.unit" label="หน่วย" :items="['กิโลกรัม', 'กรัม', 'มิลลิกรัม', 'ลิตร', 'มิลลิลิต', 'ขวด', 'ฟอง']" variant="outlined" color="primary"></v-select>
      </div>
      <v-btn variant="outlined" color="primary" class="w-full mb-6" @click="addMaterail">+ วัตถุดิบ</v-btn>
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
              <v-btn @click="onAddMenuSubmit(); isActive.value = false" class="text-primary">ตกลง</v-btn>
              <v-btn @click="isActive.value = false" class="text-red-accent-4">ยกเลิก</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
      <v-btn @click="isAddMenuItemActive = false">ปิดหน้าต่าง</v-btn>
    </div>
  </Modal>

  <!-- Edit stock item -->
  <Modal :show="isUpdateMenuItemModalActive" title="แก้ไขรายการ">
    <div>
      <v-file-input v-model="updateMenuPayload.image" label="รูปภาพ" variant="outlined" accept="image/*" @update:model-value="onFileSelect" prepend-icon="mdi-camera" show-size></v-file-input>
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
      <v-text-field v-model="updateMenuPayload.title" label="ชื่อเมนู" color="primary" variant="outlined" required></v-text-field>
      <v-textarea v-model="updateMenuPayload.detail" label="รายละเอียดเมนู" color="primary" variant="outlined" required></v-textarea>
      <v-number-input v-model="updateMenuPayload.price" label="ราคา (บาท)" color="primary" controlVariant="split" variant="outlined" required></v-number-input>
      <v-select v-model="updateMenuPayload.category" label="หมวดหมู่อาหาร / เครื่องดิ่ม" color="primary" :items="stockCategoryList" variant="outlined" required></v-select>

      <!-- Option border -->
      <div v-for="(item, index) in updateMenuPayload.option" class="border pa-3 mb-6">
        <v-select v-model="item.type" label="เลือกชนิดตัวเลือก" :items="[{title: 'เลือกได้หลายอย่าง', value: 1}, {title: 'เลือกได้อย่างเดียว', value: 2}]" item-title="title" item-value="value" variant="outlined" color="primary"></v-select>
        <v-text-field v-model="item.mainTitle" :label="'ชื่อหัวข้อตัวเลือกที่ ' + (index + 1)" color="primary" variant="outlined"></v-text-field>
        <div v-for="(subTitleItem, subTitleIndex) in item.subTitle" no-gutters>
          <v-row>
            <v-col cols="6">
              <v-text-field v-model="subTitleItem.title" :label="'ชื่อตัวเลือกที่ ' + (subTitleIndex + 1)" color="primary" variant="outlined" density="compact" class="pa-0 me-2"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-number-input v-model="subTitleItem.price" controlVariant="split" label="บวกราคาเพิ่ม" variant="outlined" color="primary" density="compact"></v-number-input>
            </v-col>
          </v-row>
        </div>
        <v-btn v-btn variant="outlined" class="w-full" @click="addSubOption(index)">เพิ่มตัวเลือก</v-btn>
      </div>
      <v-btn variant="outlined" color="primary" class="w-full mb-6" @click="addMainOption">+ เพิ่มหัวข้อตัวเลือก</v-btn>

      <!-- Material border -->
      <div v-for="(item, index) in updateMenuPayload.materail" class="border pa-3 mb-6">
        <v-select v-model="item._id" label="เลือกวัตถุดิบ" :items="stockList" variant="outlined" color="primary"></v-select>
        <v-number-input v-model="item.amount" controlVariant="split" label="ปริมาณ" color="primary" variant="outlined"></v-number-input>
        <v-select v-model="item.unit" label="หน่วย" :items="['กิโลกรัม', 'กรัม', 'มิลลิกรัม', 'ลิตร', 'มิลลิลิต', 'ขวด', 'ฟอง']" variant="outlined" color="primary"></v-select>
      </div>
      <v-btn variant="outlined" color="primary" class="w-full mb-6" @click="addMaterail">+ วัตถุดิบ</v-btn>
    </div>

    <div class="flex justify-end gap-3">
      <v-dialog max-width="500">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn v-bind="activatorProps" color="primary">อัพเดตเมนูอาหาร</v-btn>
        </template>

        <template v-slot:default="{ isActive }">
          <v-card title="ยืนยันการทำรายการ">
            <v-card-text>
              ยืนยันการทำรายการนี้หรือไม่
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="onUpdateMenuItemSubmit(updateMenuPayload._id); isActive.value = false" class="text-primary">ตกลง</v-btn>
              <v-btn @click="isActive.value = false" class="text-red-accent-4">ยกเลิก</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
      <v-dialog max-width="500">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn v-bind="activatorProps" color="error">ลบเมนูอาหาร</v-btn>
        </template>

        <template v-slot:default="{ isActive }">
          <v-card title="ยืนยันการลบรายการ">
            <v-card-text>
              ยืนยันว่าต้องการลบรายการนี้หรือไม่
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="onDeleteMenuItem(updateMenuPayload._id); isActive.value = false" class="text-primary">ตกลง</v-btn>
              <v-btn @click="isActive.value = false" class="text-red-accent-4">ยกเลิก</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
      <v-btn @click="isUpdateMenuItemModalActive = false">ปิดหน้าต่าง</v-btn>
    </div>
  </Modal>
</template>
>