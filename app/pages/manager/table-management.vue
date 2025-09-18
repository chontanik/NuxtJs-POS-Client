<script setup>
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";

const loading = ref(false);
const tables = ref([]);
const draggingTable = ref(null);
const offset = ref({ x: 0, y: 0 });

// ค่า input สำหรับขนาดโต๊ะ
const tableWidth = ref(1);
const tableHeight = ref(1);

const addTable = () => {
  tables.value.push({
    id: Date.now(),
    name: "โต๊ะใหม่",
    x: 50,
    y: 50,
    width: tableWidth.value * 80,
    height: tableHeight.value * 80,
  });
};

const deleteTable = (id) => {
  tables.value = tables.value.filter((t) => t.id !== id);
};

// ฟังก์ชันสำหรับเริ่มลาก (รองรับทั้ง mouse และ touch)
const startDrag = (event, table) => {
  event.preventDefault(); // ป้องกันการ scroll บนมือถือ
  
  // หากกำลังลากอยู่แล้ว ให้หยุดก่อน
  if (draggingTable.value) {
    stopDrag();
  }
  
  draggingTable.value = table;
  
  // ตรวจสอบว่าเป็น touch event หรือ mouse event
  const clientX = event.touches ? event.touches[0].clientX : event.clientX;
  const clientY = event.touches ? event.touches[0].clientY : event.clientY;
  
  offset.value.x = clientX - table.x;
  offset.value.y = clientY - table.y;

  // แยก event listeners ตามประเภทของ event
  if (event.touches) {
    // สำหรับ touch events
    document.addEventListener("touchmove", onDrag, { passive: false });
    document.addEventListener("touchend", stopDrag);
  } else {
    // สำหรับ mouse events
    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", stopDrag);
  }
};

// ฟังก์ชันสำหรับการลาก
const onDrag = (event) => {
  if (!draggingTable.value) return;
  
  event.preventDefault(); // ป้องกันการ scroll บนมือถือ
  
  // ตรวจสอบว่าเป็น touch event หรือ mouse event
  const clientX = event.touches ? event.touches[0].clientX : event.clientX;
  const clientY = event.touches ? event.touches[0].clientY : event.clientY;
  
  draggingTable.value.x = clientX - offset.value.x;
  draggingTable.value.y = clientY - offset.value.y;
};

// ฟังก์ชันสำหรับหยุดลาก
const stopDrag = () => {
  draggingTable.value = null;
  
  // ลบ event listeners ทั้งหมด
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
  document.removeEventListener("touchmove", onDrag);
  document.removeEventListener("touchend", stopDrag);
};

async function onTableConfigSubmit() {
  loading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 1000));

  localStorage.setItem("tableManagementData", JSON.stringify(tables.value));

  Swal.fire({
    title: "ตั้งค่าโต๊ะสำเร็จแล้ว",
    icon: "success",
    confirmButtonText: "ตกลง",
    confirmButtonColor: "#4CAF50",
    cancelButtonColor: "#f44336",
  });

  loading.value = false;
}

onMounted(() => {
  const saved = JSON.parse(localStorage.getItem("tableManagementData")) || [];
  tables.value = saved;
});
</script>

<template>
  <v-app>
    <NavBar />

    <v-main>
      <v-container fluid class="pa-4">
        <v-row>
          <!-- Sidebar -->
          <v-col cols="3">
            <v-card class="pa-4 mb-3">
              <div class="mb-2">📐 กำหนดขนาดโต๊ะ (px)</div>
              <v-number-input v-model.number="tableWidth" label="กว้าง" color="primary" type="number" control-variant="split" variant="outlined"/>
              <v-number-input v-model.number="tableHeight" label="สูง" color="primary" type="number" control-variant="split" variant="outlined"/>

              <v-btn color="primary" variant="outlined" class="w-full mt-4" @click="addTable">+ เพิ่มโต๊ะ</v-btn>
            </v-card>

            <v-card class="pa-4 mb-3">
              <v-btn color="primary" class="w-full" @click="onTableConfigSubmit">
                บันทึกการตั้งค่าโต๊ะ
              </v-btn>
            </v-card>
          </v-col>

          <!-- Workspace -->
          <v-col cols="9">
            <div class="overflow-x-scroll">
              <div class="relative bg-gray-100 border" style="height: 700px; width: 900px;">
                <div v-for="table in tables" :key="table.id" class="absolute bg-white text-black flex items-center justify-center rounded shadow cursor-move select-none" :style="{ left: table.x + 'px', top: table.y + 'px', width: table.width + 'px', height: table.height + 'px',  touchAction: 'none'}" @mousedown="(e) => startDrag(e, table)"@touchstart="(e) => startDrag(e, table)">
                  <v-btn icon variant="text" class="position-absolute -top-2 -left-2 z-10 bg-error shadow rounded-full p-0" style="width: 20px; height: 20px; min-width: 20px;"@click.stop="deleteTable(table.id)"@touchend.stop="deleteTable(table.id)"@mousedown.stop@touchstart.stop>
                    <v-icon size="14">mdi-close</v-icon>
                  </v-btn>
                  <input type="text" v-model="table.name" class="w-full outline-0 pl-2 pr-2 text-center"@mousedown.stop @touchstart.stop>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-overlay v-model="loading" class="d-flex align-center justify-center" persistent>
      <v-progress-circular indeterminate size="64" color="primary"/>
    </v-overlay>
  </v-app>
</template>