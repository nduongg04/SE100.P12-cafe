'use client'

import { useState, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Customer } from "@/lib/actions/customer.action"
import { sendVouchers } from "@/lib/actions/email.action"
import { z } from "zod"

type Voucher = {
  id: number
  code: string
}

const sendVoucherSchema = z.object({
  customers: z.array(z.number()).min(1, "Select at least one customer"),
  vouchers: z.array(z.number()).min(1, "Select at least one voucher"),
})

export function SendVouchersForm({ vouchers, customers, onClose }: { vouchers: Voucher[], customers: Customer[], onClose: () => void }) {
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([])
  const [selectedVouchers, setSelectedVouchers] = useState<number[]>([])
  const [selectedCustomerType, setSelectedCustomerType] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(false)
  const [formErrors, setFormErrors] = useState<{ customers?: string, vouchers?: string }>({})

  const customerTypes = useMemo(() => {
    const types = new Set(customers.map(c => c.customerType?.customerTypeName || "Common"))
    return Array.from(types)
  }, [customers])

  const handleCustomerTypeChange = (value: string) => {
    setSelectedCustomerType(value)
    setSelectedCustomers([])
  }

  const handleCustomerSelect = (customerId: number) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    )
    setFormErrors(prev => ({ ...prev, customers: undefined }))
  }

  const handleVoucherSelect = (voucherId: number) => {
    setSelectedVouchers(prev => 
      prev.includes(voucherId) 
        ? prev.filter(id => id !== voucherId)
        : [...prev, voucherId]
    )
    setFormErrors(prev => ({ ...prev, vouchers: undefined }))
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const validationResult = sendVoucherSchema.safeParse({
        customers: selectedCustomers,
        vouchers: selectedVouchers,
      })

      if (!validationResult.success) {
        setFormErrors(validationResult.error.flatten().fieldErrors as { customers?: string, vouchers?: string })
        return
      }

      const selectedEmails = customers
        .filter(c => selectedCustomers.includes(c.customerID))
        .map(c => c.email)
      const selectedVoucherCodes = vouchers
        .filter(v => selectedVouchers.includes(v.id))
        .map(v => v.code)

      await sendVouchers(selectedEmails, selectedVoucherCodes)
      toast({
        title: "Success",
        description: "Vouchers sent successfully",
        variant: "success",
      })
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send vouchers",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredCustomers = selectedCustomerType === "all"
    ? customers
    : customers.filter(c => (c.customerType?.customerTypeName || "Common") === selectedCustomerType)

  return (
    <div className="flex flex-col h-full space-y-4">
      <div>
        <Label htmlFor="customerType">Customer Type</Label>
        <Select onValueChange={handleCustomerTypeChange} value={selectedCustomerType}>
          <SelectTrigger id="customerType">
            <SelectValue placeholder="Select customer type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {customerTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-center mb-2">
          <Label>Select Customers</Label>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setSelectedCustomers(
              selectedCustomers.length === filteredCustomers.length
                ? []
                : filteredCustomers.map(c => c.customerID)
            )}
          >
            {selectedCustomers.length === filteredCustomers.length ? 'Deselect All' : 'Select All'}
          </Button>
        </div>
        <div className="h-[25vh] overflow-y-auto space-y-2 border rounded-md p-2">
          {filteredCustomers.map(customer => (
            <div key={customer.customerID} className="flex items-center space-x-2">
              <Checkbox
                id={`customer-${customer.customerID}`}
                checked={selectedCustomers.includes(customer.customerID)}
                onCheckedChange={() => handleCustomerSelect(customer.customerID)}
              />
              <Label htmlFor={`customer-${customer.customerID}`}>{customer.customerName}</Label>
            </div>
          ))}
        </div>
        {formErrors.customers && <p className="text-red-500 text-sm mt-1">{formErrors.customers}</p>}
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-center mb-2">
          <Label>Select Vouchers</Label>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setSelectedVouchers(
              selectedVouchers.length === vouchers.length
                ? []
                : vouchers.map(v => v.id)
            )}
          >
            {selectedVouchers.length === vouchers.length ? 'Deselect All' : 'Select All'}
          </Button>
        </div>
        <div className="h-[25vh] overflow-y-auto space-y-2 border rounded-md p-2">
          {vouchers.map(voucher => (
            <div key={voucher.id} className="flex items-center space-x-2">
              <Checkbox
                id={`voucher-${voucher.id}`}
                checked={selectedVouchers.includes(voucher.id)}
                onCheckedChange={() => handleVoucherSelect(voucher.id)}
              />
              <Label htmlFor={`voucher-${voucher.id}`}>{voucher.code}</Label>
            </div>
          ))}
        </div>
        {formErrors.vouchers && <p className="text-red-500 text-sm mt-1">{formErrors.vouchers}</p>}
      </div>

      <Button onClick={handleSubmit} className="w-full bg-[#00B074] hover:bg-[#00956A]" disabled={isLoading}>
        {isLoading ? "Sending..." : "Send Vouchers"}
      </Button>
    </div>
  )
}

