<script setup lang="js">
  import Swal from 'sweetalert2'

  const loading = ref(false);

  useHead({
    title: "หมวดหมู่ - MyPOS"
  });

  const isAddCategoryItemModalActive = ref(false);
  const isUpdateCategoryModalActive = ref(false);

  // Get category list
  const categoryList = ref([]);
  async function getCategoryList() {
    const category = JSON.parse(localStorage.getItem("category")) || [];
    categoryList.value = category;
  }
  onMounted(async () => {
    await getCategoryList();
  });

  // Add category list
  const addCategoryItemPayload = ref({
    title: null,
    detail: null,
    categoryOf: [],
  });
  async function addCategoryItem() {
    loading.value = true;

    await new Promise(resolve => setTimeout(resolve, 1000));

    const category = JSON.parse(localStorage.getItem("category")) || [];
    category.push(addCategoryItemPayload.value);
    localStorage.setItem("category", JSON.stringify(category));

    loading.value = false;
    isAddCategoryItemModalActive.value = false; // Close modal after add category success

    // Clear payload to empty for add category in next time
    addCategoryItemPayload.value = {
      title: null,
      detail: null,
      categoryOf: [],
    };

    Swal.fire({
      title: 'เพิ่มหมวดหมู่สำเร็จ',
      icon: 'success',
      confirmButtonText: 'ตกลง',
      confirmButtonColor: '#4CAF50',
      cancelButtonColor: '#f44336',
      customClass: {
        confirmButton: 'bg-primary text-white'
      },
    });

    await getCategoryList();
  }

  // Update category list
  const updateCategoryPayload = ref({
    _id: null,
    title: null,
    detail: null,
    categoryOf: [],
  });
  async function activeUpdateCategoryModal(_id) {
    const category = JSON.parse(localStorage.getItem("category")) || [];
    console.log(category[_id]);
    updateCategoryPayload.value = {
      _id: _id,
      title: category[_id]['title'],
      detail: category[_id]['detail'],
      categoryOf: category[_id]['categoryOf']
    }

    isUpdateCategoryModalActive.value = true;
  }
  async function onUpdateCateogrySubmit(_id) {
    loading.value = true;

    await new Promise(resolve => setTimeout(resolve, 1000));

    const category = JSON.parse(localStorage.getItem("category")) || [];
    console.log(category[_id]);
    category[_id] = updateCategoryPayload.value;
    localStorage.setItem("category", JSON.stringify(category));
  
    loading.value = false;
    isUpdateCategoryModalActive.value = false;

    Swal.fire({
      title: 'แก้ไขหมวดหมู่สำเร็จ',
      icon: 'success',
      confirmButtonText: 'ตกลง',
      confirmButtonColor: '#4CAF50',
      cancelButtonColor: '#f44336',
      customClass: {
        confirmButton: 'bg-primary text-white'
      },
    });
    await getCategoryList();
  }

  // Delete category list
  async function deleteCategoryItem(_id) {
    loading.value = true;

    console.log(_id);
    const category = JSON.parse(localStorage.getItem("category")) || [];
    const index = category.findIndex(item => item._id === _id);
    if (index !== -1) {
      category.splice(index, 1);
    }
    console.log(category);
    localStorage.setItem("category", JSON.stringify(category));

    loading.value = false;
    isUpdateCategoryModalActive.value = false;

    Swal.fire({
      title: 'ลบหมวดหมู่สำเร็จ',
      icon: 'success',
      confirmButtonText: 'ตกลง',
      confirmButtonColor: '#4CAF50',
      cancelButtonColor: '#f44336',
      customClass: {
        confirmButton: 'bg-primary text-white'
      },
    });

    await getCategoryList();
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
          <v-btn @click="isAddCategoryItemModalActive = true">เพิ่มหมวดหมู่</v-btn>
        </div>
        <v-hover v-for="(cateogryItem, categoryIndex) in categoryList">
          <template v-slot:default="{ isHovering, props }">
            <v-card elevation="0" v-bind="props" :color="isHovering ? 'blue-lighten-5' : ''" class="w-full border-b border-[#121212] rounded-0 pa-3" @click="activeUpdateCategoryModal(categoryIndex)">
              <div class="flex flex-wrap cursor-pointer">
                <div class="w-full lg:w-[600px] pl-4 flex justify-between">
                  <div>
                    <p class="text-lg font-bold">{{ cateogryItem.title }}</p>
                    <p>{{ cateogryItem.detail }}</p>
                    <p>เป็นหมวดหมู่ของ: 
                      <span v-for="(categoryForItem, categoryForIndex) in cateogryItem.categoryOf">
                        {{ categoryForItem }} <span v-if="categoryForIndex != cateogryItem.categoryOf.length - 1"> | </span>
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </v-card>
          </template>
        </v-hover>
      </v-container>
    </v-main>

    <!-- Overlay Loading -->
    <v-overlay v-model="loading" class="d-flex align-center justify-center" persistent>
      <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
    </v-overlay>
  </v-app>

  <!-- Add item modal -->
  <Modal :show="isAddCategoryItemModalActive" title="เพิ่มหมวดหมู่">
    <div>
      <v-text-field v-model="addCategoryItemPayload.title" label="ชื่อหมวดหมู่" color="primary" variant="outlined" required></v-text-field>
      <v-textarea v-model="addCategoryItemPayload.detail" label="รายละเอียด" color="primary" variant="outlined" required></v-textarea>
      <v-select v-model="addCategoryItemPayload.categoryOf" label="เป็นหมวดหมู่ของ" color="primary" chips multiple :items="['คลังสินค้า', 'อาหาร', 'เครื่องดื่ม']" variant="outlined" required></v-select>
    </div>

    <div class="flex justify-end gap-3">
      <v-dialog max-width="500">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn v-bind="activatorProps" color="primary">เพิ่มหมวดหมู่</v-btn>
        </template>

        <template v-slot:default="{ isActive }">
          <v-card title="ยืนยันการทำรายการ">
            <v-card-text>
              ยืนยันการทำรายการนี้หรือไม่
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="addCategoryItem(); isActive.value = false" class="text-primary">ตกลง</v-btn>
              <v-btn @click="isActive.value = false" class="text-red-accent-4">ยกเลิก</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
      <v-btn @click="isAddCategoryItemModalActive = false">ปิดหน้าต่าง</v-btn>
    </div>
  </Modal>

  <!-- Update category modal -->
  <Modal :show="isUpdateCategoryModalActive" title="แก้ไขหมวดหมู่">
    <div>
      <v-text-field v-model="updateCategoryPayload.title" label="ชื่อหมวดหมู่" color="primary" variant="outlined" required></v-text-field>
      <v-textarea v-model="updateCategoryPayload.detail" label="รายละเอียด" color="primary" variant="outlined" required></v-textarea>
      <v-select v-model="updateCategoryPayload.categoryOf" label="เป็นหมวดหมู่ของ" color="primary" chips multiple :items="['คลังสินค้า', 'อาหาร', 'เครื่องดื่ม']" variant="outlined" required></v-select>
    </div>

    <div class="flex justify-end gap-3">
      <v-dialog max-width="500">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn v-bind="activatorProps" color="primary">แก้ไขหมวดหมู่</v-btn>
        </template>

        <template v-slot:default="{ isActive }">
          <v-card title="ยืนยันการทำรายการ">
            <v-card-text>
              ยืนยันการทำรายการนี้หรือไม่
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="onUpdateCateogrySubmit(updateCategoryPayload._id); isActive.value = false" class="text-primary">ตกลง</v-btn>
              <v-btn @click="isActive.value = false" class="text-red-accent-4">ยกเลิก</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
      <v-dialog max-width="500">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn v-bind="activatorProps" color="error">ลบหมวดหมู่</v-btn>
        </template>

        <template v-slot:default="{ isActive }">
          <v-card title="ยืนยันการทำรายการ">
            <v-card-text>
              ยืนยันว่าจะลบหมวดหมู่นี้ออกหรือไม่
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="deleteCategoryItem(updateCategoryPayload._id); isActive.value = false" class="text-primary">ตกลง</v-btn>
              <v-btn @click="isActive.value = false" class="text-red-accent-4">ยกเลิก</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
      <v-btn @click="isUpdateCategoryModalActive = false">ปิดหน้าต่าง</v-btn>
    </div>
  </Modal>
</template>
