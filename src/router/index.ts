import { createRouter, createWebHistory } from 'vue-router'
import { authMiddleware } from '../middleware/auth'
import HomeView from '../views/HomeView.vue'
import DashboardView from '../views/DashboardView.vue'
import NewPrescriptionView from '../views/NewPrescriptionView.vue'
import AddPatientView from '../views/AddPatientView.vue'
import PatientHistoryView from '../views/PatientHistoryView.vue'
import AddMedicineView from '../views/AddMedicineView.vue'
import MedicineDetailsView from '../views/MedicineDetailsView.vue'
import ReportsView from '../views/ReportsView.vue'
import UsersView from '../views/UsersView.vue'
// @ts-ignore
import LoginView from '../views/LoginView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeView,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: DashboardView,
        },
        {
          path: 'new-prescription',
          name: 'new-prescription',
          component: NewPrescriptionView,
        },
        {
          path: 'add-patient',
          name: 'add-patient',
          component: AddPatientView,
        },
        {
          path: 'patient-history',
          name: 'patient-history',
          component: PatientHistoryView,
        },
        {
          path: 'add-medicine',
          name: 'add-medicine',
          component: AddMedicineView,
        },
        {
          path: 'medicine-details',
          name: 'medicine-details',
          component: MedicineDetailsView,
        },
        {
          path: 'reports',
          name: 'reports',
          component: ReportsView,
        },
        {
          path: 'users',
          name: 'users',
          component: UsersView,
        },
        // Add more children here for other sections
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false, requiresGuest: true }
    },

  ],
})

// Apply auth middleware to all routes
router.beforeEach(authMiddleware)

export default router
