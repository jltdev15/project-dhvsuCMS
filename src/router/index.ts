import { createRouter, createWebHistory } from 'vue-router'
import { authMiddleware } from '../middleware/auth'
import HomeView from '../views/HomeView.vue'
import DashboardView from '../views/DashboardView.vue'
import NewPrescriptionView from '../views/NewPrescriptionView.vue'
import PatientView from '../views/PatientView.vue'
import PatientHistoryView from '../views/PatientHistoryView.vue'
import AddMedicineView from '../views/MedicineView.vue'
import VisitLogsView from '../views/VisitLogsView.vue'
import MedicineDispensedView from '../views/MedicineDispensedView.vue'

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
          path: 'patients',
          name: 'patients',
          component: PatientView,
        },
        {
          path: 'medicines',
          name: 'medicines',
          component: AddMedicineView,
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
        {
          path: 'visit-logs',
          name: 'visit-logs',
          component: VisitLogsView,
        },
        {
          path: 'medicine-dispensed',
          name: 'medicine-dispensed',
          component: MedicineDispensedView,
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
