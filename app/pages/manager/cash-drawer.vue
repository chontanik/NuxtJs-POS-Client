<script setup lang="js">
import Swal from 'sweetalert2'

const loading = ref(false);

// ข้อมูลตัวอย่างจากรูป (สามารถ fetch จาก API ได้)
const orderDetails = {
  customerName: 'ชื่อลูกค้า',
  orderId: 'ORD123',
  dateTime: '11/09/2025 14:59:55',
  items: [
    { name: 'สินค้า A', price: 2000, qty: 1 },
    { name: 'สินค้า B', price: 3000, qty: 1 }
  ]
}

const paymentSummary = {
  subtotal: 5000,
  discount: 0,
  total: 5000,
  paid: {
    cash: 5000,
    card: 0,
    lineman: 0,
    other: 0
  },
  change: 0
}

const confirmPayment = () => {
  loading.value = true
  setTimeout(() => {
    Swal.fire({
      title: 'ปิดรอบขายแล้ว',
      icon: 'success',
      confirmButtonText: 'ตกลง',
      confirmButtonColor: '#4CAF50',
      cancelButtonColor: '#f44336',
      customClass: {
        confirmButton: 'bg-primary text-white'
      },
    });
    loading.value = false
  }, 2000)
}

useHead({
  title: "ชำระเงิน - MyPOS"
});
</script>

<template>
  <v-app>
    <!-- App Bar -->
    <NavBar></NavBar>

    <!-- Main Content -->
    <v-main>
      <v-container fluid class="pa-4">
        <v-row>
          <!-- ส่วนซ้าย: รายละเอียดการสั่งซื้อ -->
          <v-col cols="12" lg="6" class="relative">
            <v-card elevation="2" class="h-100">
              <v-card-title class="text-h6 font-weight-bold pa-4">
                เงินเข้า / เงินออก
              </v-card-title>
              <div class="px-3 py-3">
                <v-number-input label="จำนวนเงิน" control-variant="split" variant="outlined"></v-number-input>
                <v-textarea label="หมายเหตุ" variant="outlined"></v-textarea>
                <v-row>
                  <v-col cols="12" lg="6">
                    <v-btn color="success" class="w-full">เงินเข้า</v-btn>
                  </v-col>
                  <v-col cols="12" lg="6">
                    <v-btn color="error" class="w-full">เงินออก</v-btn>
                  </v-col>
                </v-row>
              </div>
              <v-card-text class="pa-4">
                <!-- History list -->
                <v-list>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title class="text-subtitle-1 text-success"><span class="font-bold text-xl">+1000</span></v-list-item-title>
                      <v-list-item-subtitle class="mb-3">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis, facilis.</v-list-item-subtitle>
                      <v-divider></v-divider>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title class="text-subtitle-1 text-error"><span class="font-bold text-xl">-1000</span></v-list-item-title>
                      <v-list-item-subtitle class="mb-3">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis, facilis.</v-list-item-subtitle>
                      <v-divider></v-divider>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
          
          <!-- ส่วนขวา: สรุปยอดเงินและชำระ -->
          <v-col cols="12" lg="6">
            <v-card elevation="2" class="h-100">
              <v-card-title class="text-h6 font-weight-bold pa-4 text-center">
                สรุปยอดเงิน
              </v-card-title>
              <div class="text-center">
                <div>
                  <span>เปิดรอบบิล</span>
                </div>
                <div>
                  <span class="text-error">13/09/2025 08:21:23</span>
                </div>
              </div>
              <v-card-text class="pa-4">
                <!-- ยอดรวมก่อนส่วนลด -->
                <v-row class="align-center">
                  <v-col cols="8">
                    <span class="text-body-1 font-weight-bold">ยอดเงินเริ่มต้น</span>
                  </v-col>
                  <v-col cols="4" class="text-right">
                    <span class="text-body-1 font-weight-bold">0 บาท</span>
                  </v-col>
                </v-row>
                
                <v-divider class="my-2"></v-divider>
                
                <v-row class="align-center mb-3" no-gutters>
                  <v-col cols="8">
                    <span class="text-body-1 font-weight-bold">ยอดเงินสด</span>
                  </v-col>
                  <v-col cols="4" class="text-right">
                    <span class="text-body-1 font-weight-bold">0 บาท</span>
                  </v-col>
                </v-row>

                <v-row class="align-center mb-2" no-gutters>
                  <v-col cols="8">
                    <span>- เงินสด</span>
                  </v-col>
                  <v-col cols="4" class="text-body-1 text-right">
                    <span>0 บาท</span>
                  </v-col>
                </v-row>

                <v-row class="align-center mb-2" no-gutters>
                  <v-col cols="8">
                    <span>- บัตร</span>
                  </v-col>
                  <v-col cols="4" class="text-body-1 text-right">
                    <span>0 บาท</span>
                  </v-col>
                </v-row>

                <v-row class="align-center mb-2" no-gutters>
                  <v-col cols="8">
                    <span>- โอนเงิน</span>
                  </v-col>
                  <v-col cols="4" class="text-body-1 text-right">
                    <span>0 บาท</span>
                  </v-col>
                </v-row>

                <v-row class="align-center mb-2" no-gutters>
                  <v-col cols="8">
                    <span>- อื่นๆ</span>
                  </v-col>
                  <v-col cols="4" class="text-body-1 text-right">
                    <span>0 บาท</span>
                  </v-col>
                </v-row>

                <v-divider class="my-2"></v-divider>

                <v-row class="align-center">
                  <v-col cols="8">
                    <span class="text-body-1 font-weight-bold">การคืนเงิน</span>
                  </v-col>
                  <v-col cols="4" class="text-right">
                    <span class="text-body-1 font-weight-bold">0 บาท</span>
                  </v-col>
                </v-row>

                <v-divider class="my-2"></v-divider>

                <v-row class="align-center">
                  <v-col cols="8">
                    <span class="text-body-1 font-weight-bold">เงินเข้า/ออก</span>
                  </v-col>
                  <v-col cols="4" class="text-right">
                    <span class="text-body-1 font-weight-bold">0 บาท</span>
                  </v-col>
                </v-row>

                <v-divider class="my-2"></v-divider>

                <div class="w-full mt-6 mb-6">
                  <div class="text-center">
                    <div class="mb-2">
                      <span class="text-body-1 font-weight-bold">จำนวนเงินที่ควรมีในถาดเก็บเงิน</span>
                    </div>
                    <div>
                      <span class="text-2xl text-success">0</span>
                    </div>
                  </div>
                </div>

                <v-row class="align-center" no-gutters>
                  <v-col cols="8">
                    <span class="text-body-1 font-weight-bold">จำนวนเงินที่มีอยู่จริง</span>
                  </v-col>
                  <v-col cols="4" class="text-right">
                    <span class="text-body-1">
                      <v-number-input label="จำนวนเงิน" control-variant="split" variant="outlined" color="primary" density="compact" class="pa-0 ma-0"></v-number-input>
                    </span>
                  </v-col>
                </v-row>

                <v-row class="align-center" no-gutters>
                  <v-col cols="8">
                    <span class="text-body-1 font-weight-bold">ส่วนต่าง</span>
                  </v-col>
                  <v-col cols="4" class="text-center">
                    <span class="text-body-1">0</span>
                  </v-col>
                </v-row>
              </v-card-text>
              
              <!-- ปุ่มยืนยัน -->
              <v-card-actions class="pa-4">
                <v-spacer></v-spacer>
                <v-btn color="orange darken-1" variant="elevated" size="large" block @click="confirmPayment">
                  ปิดรอบขาย
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Overlay Loading -->
    <v-overlay v-model="loading" class="d-flex align-center justify-center" persistent>
      <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
    </v-overlay>
  </v-app>
</template>