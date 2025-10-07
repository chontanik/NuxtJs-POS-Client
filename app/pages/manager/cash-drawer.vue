<script setup lang="js">
  import Swal from 'sweetalert2'

  useHead({
    title: "ลินชักเก็บเงิน - MyPOS"
  });

  const loading = ref(false);
  const isOpenForSales = ref(false);
  const openForSalesAmount = ref(0);

  // Fetch data (Dummy)
  onMounted(async () => {
    isOpenForSales.value = localStorage.getItem("isOpenForSales") == "true";
    openForSalesAmount.value = localStorage.getItem("openForSalesAmount");
  });

  const cashInCashOutList = ref([]);
  async function getCashInCashOut() {
    const list = JSON.parse(localStorage.getItem("cashInCashOutList")) || [];
    cashInCashOutList.value = list;
  }
  onMounted(async () => {
    await getCashInCashOut();
  });

  // Summit CashInCashOut (Dummy)
  const cashInCashOutPayload = ref({
    type: null,
    amount: null,
    option: 1,
    note: null
  });

  async function onCashInSubmit() {
    try {
      cashInCashOutPayload.value.type = "IN";
  
      if (cashInCashOutPayload.value.amount == null || cashInCashOutPayload.value.amount == null) {
        Swal.fire({
          title: 'โปรดกรอกข้อมูลให้ครบถ้วน',
          icon: 'error',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#4CAF50',
          cancelButtonColor: '#f44336',
          customClass: {
            confirmButton: 'bg-primary text-white'
          },
        });
        return "payload is can not be null";
      }
  
      loading.value = true;
  
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      
      // Save dummy data to local storage
      const cashInCashOutList = JSON.parse(localStorage.getItem("cashInCashOutList")) || [];
      cashInCashOutList.push(cashInCashOutPayload.value);
      localStorage.setItem("cashInCashOutList", JSON.stringify(cashInCashOutList));
  
      // Clear form to empty
      cashInCashOutPayload.value = {
        type: null,
        amount: null,
        option: 1,
        note: null
      }; 

      Swal.fire({
        title: 'นำเงินเข้าสำเร็จ',
        icon: 'success',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#4CAF50',
        cancelButtonColor: '#f44336',
        customClass: {
          confirmButton: 'bg-primary text-white'
        },
      });
  
      await getCashInCashOut();
      loading.value = false;
    } catch (err) {
      loading.value = false;
      console.error(err);

      Swal.fire({
        title: err.message,
        icon: 'error',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#4CAF50',
        cancelButtonColor: '#f44336',
        customClass: {
          confirmButton: 'bg-primary text-white'
        },
      });
    }
  }

  async function onCashOutSubmit() {
    try {
      cashInCashOutPayload.value.type = "OUT";
  
      if (cashInCashOutPayload.value.amount == null || cashInCashOutPayload.value.amount == null) {
        Swal.fire({
          title: 'โปรดกรอกข้อมูลให้ครบถ้วน',
          icon: 'error',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#4CAF50',
          cancelButtonColor: '#f44336',
          customClass: {
            confirmButton: 'bg-primary text-white'
          },
        });
        return "payload is can not be null";
      }
  
      loading.value = true;
  
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      
      // Save dummy data to local storage
      const cashInCashOutList = JSON.parse(localStorage.getItem("cashInCashOutList")) || [];
      cashInCashOutList.push(cashInCashOutPayload.value);
      localStorage.setItem("cashInCashOutList", JSON.stringify(cashInCashOutList));
  
      // Clear form to empty
      cashInCashOutPayload.value = {
        type: null,
        amount: null,
        option: 1,
        note: null
      }; 

      Swal.fire({
        title: 'นำเงินออกสำเร็จ',
        icon: 'success',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#4CAF50',
        cancelButtonColor: '#f44336',
        customClass: {
          confirmButton: 'bg-primary text-white'
        },
      });

      await getCashInCashOut();
      loading.value = false;
    } catch (err) {
      loading.value = false;
      console.error(err);

      Swal.fire({
        title: err.message,
        icon: 'error',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#4CAF50',
        cancelButtonColor: '#f44336',
        customClass: {
          confirmButton: 'bg-primary text-white'
        },
      });
    }
  }

  async function onCloseForSalesSubmit() {
    loading.value = true;
    isOpenForSales.value = false;
    openForSalesAmount.value = 0;
    
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    
    localStorage.setItem('isOpenForSales', false);
    localStorage.setItem('openForSalesAmount', 0);
    localStorage.removeItem('cashInCashOutList');
    
    Swal.fire({
      title: 'ปิดรอบการขายแล้ว',
      icon: 'success',
      confirmButtonText: 'ตกลง',
      confirmButtonColor: '#4CAF50',
      cancelButtonColor: '#f44336',
      customClass: {
        confirmButton: 'bg-primary text-white'
      },
    });
    
    await getCashInCashOut();
    loading.value = false;
  }
</script>

<template>
  <v-app>
    <!-- App Bar -->
    <NavBar></NavBar>

    <!-- Main Content -->
    <v-main>
      <v-container>
        <v-row>
          <!-- ส่วนซ้าย: รายละเอียดการสั่งซื้อ -->
          <v-col cols="12" sm="6">
            <v-card elevation="2">
              <v-card-title class="text-h6 font-weight-bold pa-4 text-center">
                เงินเข้า / เงินออก
              </v-card-title>
              <div class="px-3 py-3">
                <v-number-input v-model="cashInCashOutPayload.amount" label="จำนวนเงิน" control-variant="split" variant="outlined" color="primary" :disabled="!isOpenForSales"></v-number-input>
                <v-select v-model="cashInCashOutPayload.option" label="วิธีการชำระเงิน" :items="[{title: 'เงินสด', value: 1}, {title: 'บัตร', value: 2}, {title: 'โอนเงิน', value: 4}, {title: 'อื่นๆ', value: 5}]" item-title="title" item-value="value" variant="outlined" color="primary" :disabled="!isOpenForSales"/>
                <v-textarea v-model="cashInCashOutPayload.note" label="หมายเหตุ" variant="outlined" color="primary" :disabled="!isOpenForSales"></v-textarea>
                <v-row>
                  <v-col cols="12" lg="6">
                    <v-btn color="success" class="w-full" :disabled="!isOpenForSales" @click="onCashInSubmit">เงินเข้า</v-btn>
                  </v-col>
                  <v-col cols="12" lg="6">
                    <v-btn color="error" class="w-full" :disabled="!isOpenForSales" @click="onCashOutSubmit">เงินออก</v-btn>
                  </v-col>
                </v-row>
              </div>
              <v-card-text class="pa-4">
                <!-- History list -->
                <div>
                  <span class="text-lg">ประวัติทำรายการ</span>
                </div>
                <v-list class="overflow-y-scroll h-[300px]">
                  <v-list-item v-for="(item, index) in cashInCashOutList" :key="index">
                    <v-list-item-content>
                      <v-list-item-title class="text-subtitle-1" :class="item.type == 'IN' ? 'text-success' : 'text-error'">
                        <span class="font-bold text-xl">
                          <span v-if="item.type == 'IN'">+</span>
                          <span v-else>-</span>
                          <span>{{ item.amount }}</span>
                        </span>
                      </v-list-item-title>
                      <v-list-item-subtitle class="mb-3">{{ item.note }}</v-list-item-subtitle>
                      <v-divider></v-divider>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
          
          <!-- ส่วนขวา: สรุปยอดเงินและชำระ -->
          <v-col cols="12" sm="6">
            <v-card elevation="2" class="h-full">
              <v-card-title class="text-h6 font-weight-bold pa-4 text-center">
                สรุปยอดเงิน
              </v-card-title>

              <div v-if="isOpenForSales" class="text-center">
                <div>
                  <span>เปิดรอบบิล</span>
                </div>
                <div>
                  <span class="text-error">13/09/2025 08:21:23</span>
                </div>
              </div>
              <div v-else class="text-center">
                <span class="text-error">ยังไม่เปิดรอบการขาย</span>
              </div>

              <v-card-text class="pa-4">
                <!-- ยอดรวมก่อนส่วนลด -->
                <v-row class="align-center">
                  <v-col cols="8">
                    <span class="text-body-1 font-weight-bold">ยอดเงินเริ่มต้น</span>
                  </v-col>
                  <v-col cols="4" class="text-right">
                    <span class="text-body-1 font-weight-bold">{{ Number(openForSalesAmount).toLocaleString("TH-th") }} บาท</span>
                  </v-col>
                </v-row>
                
                <v-divider class="my-2"></v-divider>
                
                <v-row class="align-center mb-3" no-gutters>
                  <v-col cols="8">
                    <span class="text-body-1 font-weight-bold">ยอดเงิน</span>
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
                      <span class="text-body-1 font-weight-bold">จำนวนเงินที่ควรมีในลิ้นชักเก็บเงิน</span>
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
                      <v-number-input label="จำนวนเงิน" control-variant="split" variant="outlined" color="primary" density="compact" class="pa-0 ma-0" :disabled="!isOpenForSales"></v-number-input>
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
                <v-dialog max-width="500">
                  <template v-slot:activator="{ props: activatorProps }">
                    <v-btn v-bind="activatorProps" color="orange darken-1" variant="elevated" size="large" block :disabled="!isOpenForSales">ปิดรอบขาย</v-btn>
                  </template>

                  <template v-slot:default="{ isActive }">
                    <v-card title="ยืนยันเปิดรอบการขาย">
                      <v-card-text>
                        ยืนยันการเปิดรอบการขาย
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click="onCloseForSalesSubmit(); isActive.value = false" class="text-primary">ตกลง</v-btn>
                        <v-btn @click="isActive.value = false" class="text-red-accent-4">ยกเลิก</v-btn>
                      </v-card-actions>
                    </v-card>
                  </template>
                </v-dialog>
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