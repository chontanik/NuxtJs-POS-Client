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

// ฟังก์ชันยืนยันชำระ (ตัวอย่าง)
const confirmPayment = () => {
  loading.value = true
  setTimeout(() => {
    Swal.fire('ชำระเงินสำเร็จ!', '', 'success')
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
          <v-col cols="12" lg="6">
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
              <v-card-text class="pa-4">
                <!-- ยอดรวมก่อนส่วนลด -->
                <v-row class="align-center">
                  <v-col cols="8">
                    <span class="text-body-1">ยอดขาย</span>
                  </v-col>
                  <v-col cols="4" class="text-right">
                    <span class="text-body-1 font-weight-bold">{{ paymentSummary.subtotal }} บาท</span>
                  </v-col>
                </v-row>
                
                <!-- ส่วนลด -->
                <v-row class="align-center">
                  <v-col cols="8">
                    <span class="text-body-1">ส่วนลด</span>
                  </v-col>
                  <v-col cols="4" class="text-right">
                    <span class="text-body-1">-{{ paymentSummary.discount }} บาท</span>
                  </v-col>
                </v-row>
                
                <v-divider class="my-2"></v-divider>
                
                <!-- ยอดสุทธิ -->
                <v-row class="align-center">
                  <v-col cols="8">
                    <span class="text-subtitle-1 font-weight-bold">ยอดที่ต้องชำระ</span>
                  </v-col>
                  <v-col cols="4" class="text-right">
                    <span class="text-subtitle-1 font-weight-bold text-success">{{ paymentSummary.total }} บาท</span>
                  </v-col>
                </v-row>
                
                <v-divider class="my-2"></v-divider>
                
                <!-- วิธีชำระ -->
                <v-row class="align-center mb-2">
                  <v-col cols="8">
                    <span class="text-body-1">ชำระด้วย</span>
                  </v-col>
                  <v-col cols="4" class="text-right">
                    <span class="text-body-1">เงินสด</span>
                  </v-col>
                </v-row>
                
                <!-- ยอดชำระแต่ละวิธี -->
                <v-row v-for="(value, method) in paymentSummary.paid" :key="method" class="align-center" :class="{ 'text-error': method === 'lineman' }">
                  <v-col cols="8" class="text-lowercase">
                    <span class="text-body-2">- {{ method === 'lineman' ? 'lineman' : method === 'card' ? 'บัตร' : method === 'other' ? 'อื่นๆ' : 'เงินสด' }}</span>
                  </v-col>
                  <v-col cols="4" class="text-right">
                    <span class="text-body-2">{{ value }} บาท</span>
                  </v-col>
                </v-row>
                
                <v-divider class="my-2"></v-divider>
                
                <!-- เงินทอน -->
                <v-row class="align-center">
                  <v-col cols="8">
                    <span class="text-subtitle-1 font-weight-bold">เงินทอน</span>
                  </v-col>
                  <v-col cols="4" class="text-right">
                    <span class="text-subtitle-1 font-weight-bold text-warning">{{ paymentSummary.change }} บาท</span>
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

<style scoped>
/* เพิ่มสไตล์เพื่อให้ใกล้เคียงรูป */
.v-card {
  border-radius: 8px;
}
.text-success {
  color: #4CAF50 !important;
}
.text-warning {
  color: #FF9800 !important;
}
.text-error {
  color: #F44336 !important;
}
</style>