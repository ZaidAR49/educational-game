"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { ConfirmModal } from "@/components/shared/ConfirmModal"
import { deleteOrganizationAction } from "@/lib/actions/organizations.actions"
import { toast } from "sonner"

interface DeleteOrganizationButtonProps {
  orgId: string
  orgName: string
}

export function DeleteOrganizationButton({ orgId, orgName }: DeleteOrganizationButtonProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    const toastId = toast.loading(`جاري حذف المؤسسة ${orgName}...`)
    try {
      await deleteOrganizationAction(orgId)
      toast.success("تم الحذف بنجاح", { id: toastId })
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error("حدث خطأ أثناء الحذف", { id: toastId })
    } finally {
      setIsDeleting(false)
      setIsOpen(false)
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        disabled={isDeleting}
        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="حذف"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <ConfirmModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        title="حذف المؤسسة نهائياً؟"
        description={`تنبيه هام: إذا قمت بحذف هذه المؤسسة ("${orgName}")، سيتم أيضاً حذف جميع الألعاب المرتبطة بها وجميع بياناتها نهائياً ولا يمكن التراجع عن هذا الإجراء.`}
        confirmText="نعم، احذف المؤسسة والألعاب"
        cancelText="إلغاء"
        type="danger"
      />
    </>
  )
}
