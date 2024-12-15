'use server'

import { revalidatePath } from 'next/cache'
import { authenticatedFetch } from '../auth'

export interface Customer {
  customerID: number
  customerName: string
  phoneNumber: string
  email: string
  revenue: number
  customerType: {
    customerTypeID: number
    customerTypeName: string
    discountValue: number
    boundaryRevenue: number
  } | null
}

export async function getAllCustomers(): Promise<Customer[]> {
  try {
    const response = await authenticatedFetch(`${process.env.BASE_URL}/customer/getall`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch customers')
    }

    const customers: Customer[] = await response.json()
    return customers
  } catch (error) {
    console.error('Error fetching customers:', error)
    throw error
  }
}

// export async function createCustomer(customerData: Omit<Customer, 'customerID'>): Promise<Customer> {
//   try {
//     const response = await authenticatedFetch(`${process.env.BASE_URL}/customer/create`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(customerData),
//     })

//     if (!response.ok) {
//       throw new Error('Failed to create customer')
//     }

//     const newCustomer: Customer = await response.json()
//     revalidatePath('/admin/customer')
//     return newCustomer
//   } catch (error) {
//     console.error('Error creating customer:', error)
//     throw error
//   }
// }

// export async function updateCustomer(customerData: Customer): Promise<Customer> {
//   try {
//     const response = await authenticatedFetch(`${process.env.BASE_URL}/customer/update`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(customerData),
//     })

//     if (!response.ok) {
//       throw new Error('Failed to update customer')
//     }

//     const updatedCustomer: Customer = await response.json()
//     revalidatePath('/admin/customer')
//     return updatedCustomer
//   } catch (error) {
//     console.error('Error updating customer:', error)
//     throw error
//   }
// }

// export async function deleteCustomer(customerID: number): Promise<void> {
//   try {
//     const response = await authenticatedFetch(`${process.env.BASE_URL}/customer/delete/${customerID}`, {
//       method: 'DELETE',
//     })

//     if (!response.ok) {
//       throw new Error('Failed to delete customer')
//     }

//     revalidatePath('/admin/customer')
//   } catch (error) {
//     console.error('Error deleting customer:', error)
//     throw error
//   }
// }

