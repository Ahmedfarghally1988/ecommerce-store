"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Generates a unique invoice number
async function generateInvoiceNumber(): Promise<string> {
  const count = await prisma.invoice.count();
  const dateStr = new Date().toISOString().slice(0, 7).replace('-', '');
  return `INV-${dateStr}-${(count + 1).toString().padStart(4, '0')}`;
}

export async function createInvoice(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
      },
    });

    if (!order) {
      return { success: false, error: "الطلب غير موجود" };
    }

    const invoiceNumber = await generateInvoiceNumber();

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        orderId: order.id,
        amount: order.total,
        currency: order.currency,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
      },
    });

    revalidatePath("/[locale]/(admin)/admin/(dashboard)/orders");
    revalidatePath(`/[locale]/(admin)/admin/(dashboard)/orders/${order.id}`);
    revalidatePath("/[locale]/(admin)/admin/(dashboard)/invoices");

    return { success: true, data: invoice };
  } catch (error: any) {
    console.error("Error creating invoice:", error);
    return { success: false, error: "حدث خطأ أثناء إنشاء الفاتورة" };
  }
}

export async function getInvoices(filters?: { month?: string, dateFrom?: string, dateTo?: string, orderNumber?: string, invoiceNumber?: string }) {
  try {
    const whereClause: any = {};

    if (filters?.orderNumber) {
      whereClause.order = {
        orderNumber: {
          contains: filters.orderNumber,
        },
      };
    }

    if (filters?.invoiceNumber) {
      whereClause.invoiceNumber = {
        contains: filters.invoiceNumber,
      };
    }

    if (filters?.month) {
      // month is expected to be "YYYY-MM"
      const [year, month] = filters.month.split('-');
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 1);
      
      whereClause.createdAt = {
        gte: startDate,
        lt: endDate,
      };
    }

    if (filters?.dateFrom || filters?.dateTo) {
      whereClause.createdAt = {
        ...whereClause.createdAt,
      };
      
      if (filters.dateFrom) {
        whereClause.createdAt.gte = new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        // Add one day to include the end date fully
        const toDate = new Date(filters.dateTo);
        toDate.setDate(toDate.getDate() + 1);
        whereClause.createdAt.lt = toDate;
      }
    }

    const invoices = await prisma.invoice.findMany({
      where: whereClause,
      include: {
        order: {
          select: {
            orderNumber: true,
            status: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { success: true, data: invoices };
  } catch (error: any) {
    console.error("Error fetching invoices:", error);
    return { success: false, error: "حدث خطأ أثناء جلب الفواتير", data: [] };
  }
}

export async function getInvoiceById(id: string) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            items: true,
          }
        },
      },
    });

    if (!invoice) {
      return { success: false, error: "الفاتورة غير موجودة" };
    }

    return { success: true, data: invoice };
  } catch (error: any) {
    console.error("Error fetching invoice:", error);
    return { success: false, error: "حدث خطأ أثناء جلب الفاتورة" };
  }
}

export async function deleteInvoice(id: string) {
  try {
    const invoice = await prisma.invoice.delete({
      where: { id },
    });

    revalidatePath("/[locale]/(admin)/admin/(dashboard)/orders");
    revalidatePath(`/[locale]/(admin)/admin/(dashboard)/orders/${invoice.orderId}`);
    revalidatePath("/[locale]/(admin)/admin/(dashboard)/invoices");

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting invoice:", error);
    return { success: false, error: "حدث خطأ أثناء حذف الفاتورة" };
  }
}
