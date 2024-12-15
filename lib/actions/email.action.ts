'use server'

import { revalidatePath } from 'next/cache'
import { authenticatedFetch } from '../auth'

export async function sendVouchers(listEmail: string[], listVoucher: string[]) {
  try {
    const response = await authenticatedFetch(`${process.env.BASE_URL}/sendemail/sendmany`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ listEmail, listVoucher }),
    })

		const result = await response.json()
		// revalidatePath('/admin/voucher')
		console.log(result)
    if (!response.ok) {
      throw new Error('Failed to send vouchers')
    }

    return result
  } catch (error) {
    console.error('Error sending vouchers:', error)
    throw error
  }
}

