<script setup lang="js">
  import Swal from 'sweetalert2'

  const loading = ref(false);

  useHead({
    title: "สินค้าในคลัง - MyPOS"
  });

  const isAddStockItemModalActive = ref(false);
  const isUpdateStockItemModalActive = ref(false);
  const isDeleteStockItemModalActive = ref(false);

  // Get stock category
  const stockCategoryList = ref([]);
  async function getStockCategoryList() {
    const category = JSON.parse(localStorage.getItem("category")) || [];
    const categoryFillter = category.filter(item => item.categoryOf.includes("คลังสินค้า"));

    for (var i = 0; i < categoryFillter.length; i++) {
      stockCategoryList.value.push(categoryFillter[i]['title']);
    }
  }
  onMounted(async () => {
    await getStockCategoryList();
  });

  // Get stock item list
  const stockItemList = ref([]);
  async function getStockItemList() {
    const stockList = JSON.parse(localStorage.getItem("stockList")) || [];
    stockItemList.value = stockList;
  }
  onMounted(async () => {
    await getStockItemList();
  });

  // Add stock item list
  const addStockItemPayload = ref({
    status: 1,
    title: null,
    image: null,
    img: "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg",
    detail: null,
    category: null,
    amount: 1,
    unit: null,
    price: 0
  });
  async function addStockItem() {
    console.log(addStockItemPayload.value);
    // Check empty input payload value
    if (addStockItemPayload.value.title == null || addStockItemPayload.value.category == null || addStockItemPayload.value.unit == null) {
      // Active sweet alert. Error some input is empty value
      Swal.fire({
        title: 'โปรดกรอกข้อมูลให้ครบ',
        icon: 'error',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#4CAF50',
        cancelButtonColor: '#f44336',
        customClass: {
          confirmButton: 'bg-primary text-white'
        },
      });

      console.error("Can't submit empty input!");
      return "Can't submit empty input!";
    }

    // Begin add stock item
    console.log("adding stock item");
    loading.value = true;

    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const stockList = JSON.parse(localStorage.getItem("stockList")) || [];
    stockList.push(addStockItemPayload.value);
    localStorage.setItem("stockList", JSON.stringify(stockList));

    // Active sweet alert. Add stock item success
    Swal.fire({
      title: 'เพิ่มสินค้าในสต็อกสำเร็จ',
      icon: 'success',
      confirmButtonText: 'ตกลง',
      confirmButtonColor: '#4CAF50',
      cancelButtonColor: '#f44336',
      customClass: {
        confirmButton: 'bg-primary text-white'
      },
    });

    isAddStockItemModalActive.value = false;
    loading.value = false;

    // Clear payload after add item success
    addStockItemPayload.value = {
      title: null,
      status: 1,
      image: null,
      img: "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg",
      detail: null,
      category: null,
      amount: 1,
      unit: null,
      price: 0
    };
    imagePreview.value = "";
    fileInput.value = null;

    await getStockItemList();

    console.log("add stock item succesed");
  }

  // Update stock item
  const updateStockItemPayload = ref({
    _id: null,
    status: 1,
    title: null,
    image: null,
    img: "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg",
    detail: null,
    category: null,
    amount: 1,
    unit: null,
    price: 0
  });
  async function activeUpdateStockItemModal(_id) {
    isUpdateStockItemModalActive.value = true;
    console.log(_id);

    const stockList = JSON.parse(localStorage.getItem("stockList")) || [];
    console.log(stockList[_id]);

    updateStockItemPayload.value = {
      _id: _id,
      status: 1,
      title: stockList[_id]['title'],
      image: stockList[_id]['image'],
      img: "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg",
      detail: stockList[_id]['detail'],
      category: stockList[_id]['category'],
      amount: stockList[_id]['amount'],
      unit: stockList[_id]['unit'],
      price: stockList[_id]['price']
    }
  }
  async function onUpdateStockItemSubmit(_id) {
    loading.value = true;

    await new Promise(resolve => setTimeout(resolve, 1000));

    const stockList = JSON.parse(localStorage.getItem("stockList")) || [];
    console.log(stockList[_id]);
    stockList[_id] = updateStockItemPayload.value;
    localStorage.setItem("stockList", JSON.stringify(stockList));
  
    loading.value = false;
    isUpdateStockItemModalActive.value = false;

    Swal.fire({
      title: 'แก้ไขสินค้าในคลังสำเร็จ',
      icon: 'success',
      confirmButtonText: 'ตกลง',
      confirmButtonColor: '#4CAF50',
      cancelButtonColor: '#f44336',
      customClass: {
        confirmButton: 'bg-primary text-white'
      },
    });
    await getStockItemList();
  }

  // Delete stock item
  async function onDeleteStockItem(_id) {
    loading.value = true;

    console.log(_id);
    const stockList = JSON.parse(localStorage.getItem("stockList")) || [];
    const index = stockList.findIndex(item => item._id === _id);
    if (index !== -1) {
      stockList.splice(index, 1);
    }
    console.log(stockList);
    localStorage.setItem("stockList", JSON.stringify(stockList));

    loading.value = false;
    isUpdateStockItemModalActive.value = false;

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

    await getStockItemList();
  }

  // Upload image and preview image
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
</script>

<template>
  <v-app>
    <!-- App Bar -->
    <NavBar></NavBar>

    <!-- Main Content -->
    <v-main>
      <v-container>
        <div class="flex justify-between gap-3 mb-3 py-3 border-b border-[#121212]">
          <v-btn @click="isAddStockItemModalActive = true">เพิ่มสินค้าในคลัง</v-btn>

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
          <v-hover v-for="(stockItem, stockIndex) in stockItemList">
            <template v-slot:default="{ isHovering, props }">
              <v-card elevation="0" v-bind="props" :color="isHovering ? 'blue-lighten-5' : ''" class="w-full border-b border-[#121212] rounded-0 pa-3" @click="activeUpdateStockItemModal(stockIndex)">
                <div class="flex flex-wrap cursor-pointer">
                  <div class="w-[120px] h-[120px] flex-shrink-0 mb-3 lg:mb-0">
                    <img src="https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg" alt="เนื้อหมู" class="w-full h-full object-cover rounded" />
                  </div>
                  <div class="ml-3">
                    <p class="bg-green-200 rounded w-fit px-3">#สถานะ</p>
                    <p class="text-lg font-bold">{{ stockItem.title }}</p>
                    <p>{{ stockItem.detail }}</p>
                    <p>หมวดหมู่: 
                      <span>{{ stockItem.category }}</span>
                    </p>
                    <p>คงเหลือ: {{ Number(stockItem.amount).toLocaleString("TH-th") }} {{ stockItem.unit }}</p>
                    <p><span class="font-bold text-lg">{{ Number(stockItem.price).toLocaleString("TH-th") }}</span> บาท</p>
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

  <!-- Add stock item modal -->
  <Modal :show="isAddStockItemModalActive" title="เพิ่มรายการสินค้าคงคลัง">
    <div>
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
      <v-row>
        <v-col>
          <v-file-input v-model="addStockItemPayload.image" label="รูปภาพ" variant="outlined" accept="image/*" @update:model-value="onFileSelect" prepend-icon="mdi-camera" show-size></v-file-input>
        </v-col>
        <v-col>
          <v-text-field v-model="addStockItemPayload.title" label="ชื่อรายการ" color="primary" variant="outlined"></v-text-field>
        </v-col>
      </v-row>
      <v-textarea v-model="addStockItemPayload.detail" label="รายละเอียด" color="primary" variant="outlined"></v-textarea>
      <v-row>
        <v-col>
          <v-number-input v-model="addStockItemPayload.amount" label="จำนวน" color="primary" controlVariant="split" variant="outlined"></v-number-input>
        </v-col>
        <v-col>
          <v-select v-model="addStockItemPayload.unit" label="หน่วย" color="primary" :items="['กิโลกรัม', 'ลิตร', 'ขวด', 'ถุง']" variant="outlined"></v-select>
        </v-col>
      </v-row>
      <v-number-input v-model="addStockItemPayload.price" label="ราคา (บาท)" color="primary" controlVariant="split" variant="outlined"></v-number-input>
      <v-select v-model="addStockItemPayload.category" label="หมวดหมู่" color="primary" :items="stockCategoryList" variant="outlined"></v-select>
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
  </Modal>

  <!-- Edit stock item -->
  <Modal :show="isUpdateStockItemModalActive" title="อัพเดตรายการสินค้าในคลัง">
    <div>
      <v-select v-model="updateStockItemPayload.status" label="สถานะ" color="primary" :items="[{title: 'ปกติ', value: 1}, {title: 'ของหมด', value: 2}]" item-title="title" item-value="value" variant="outlined"></v-select>
      <div v-if="updateStockItemPayload.img" class="mb-4">
        <v-card class="mx-auto" max-width="300">
          <v-img :src="updateStockItemPayload.img" height="200" cover></v-img>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" variant="text" @click="removeImage" size="small">
              ลบรูปภาพ
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
      <v-row>
        <v-col>
          <v-file-input v-model="updateStockItemPayload.image" label="รูปภาพ" variant="outlined" accept="image/*" @update:model-value="onFileSelect" prepend-icon="mdi-camera" show-size></v-file-input>
        </v-col>
        <v-col>
          <v-text-field v-model="updateStockItemPayload.title" label="ชื่อรายการ" color="primary" variant="outlined"></v-text-field>
        </v-col>
      </v-row>
      <v-textarea v-model="updateStockItemPayload.detail" label="รายละเอียด" color="primary" variant="outlined"></v-textarea>
      <v-row>
        <v-col>
          <v-number-input v-model="updateStockItemPayload.amount" label="จำนวน" color="primary" controlVariant="split" variant="outlined"></v-number-input>
        </v-col>
        <v-col>
          <v-select v-model="updateStockItemPayload.unit" label="หน่วย" color="primary" :items="['กิโลกรัม', 'ลิตร', 'ขวด', 'ถุง']" variant="outlined"></v-select>
        </v-col>
      </v-row>
      <v-number-input v-model="updateStockItemPayload.price" label="ราคา (บาท)" color="primary" controlVariant="split" variant="outlined"></v-number-input>
      <v-select v-model="updateStockItemPayload.category" label="หมวดหมู่" color="primary" :items="stockCategoryList" variant="outlined"></v-select>
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
              <v-btn @click="onUpdateStockItemSubmit(updateStockItemPayload._id); isActive.value = false" class="text-primary">ตกลง</v-btn>
              <v-btn @click="isActive.value = false" class="text-red-accent-4">ยกเลิก</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
      <v-dialog max-width="500">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn v-bind="activatorProps" color="error">ลบออก</v-btn>
        </template>

        <template v-slot:default="{ isActive }">
          <v-card title="ยืนยันการทำรายการ">
            <v-card-text>
              ยืนยันการทำรายการนี้หรือไม่
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="onDeleteStockItem(updateStockItemPayload._id); isActive.value = false" class="text-primary">ตกลง</v-btn>
              <v-btn @click="isActive.value = false" class="text-red-accent-4">ยกเลิก</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
      <v-btn @click="isUpdateStockItemModalActive = false">ปิดหน้าต่าง</v-btn>
    </div>
  </Modal>
</template>
