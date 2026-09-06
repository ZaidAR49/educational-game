"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { ConfirmModal } from "@/components/shared/ConfirmModal"
import { deleteOrganizationAction } from "@/lib/actions/organizations.actions"
import { toast } from "sonner"
import { useLocale } from "@/lib/i18n/LanguageContext"

interface DeleteOrganizationButtonProps {
  orgId: string
  orgName: string
}

export function DeleteOrganizationButton({ orgId, orgName }: DeleteOrganizationButtonProps) {
  const router = useRouter()
  const { t, isRTL } = useLocale()
  const o = t.organizations
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    const toastId = toast.loading(o.deletingToast.replace("{name}", orgName))
    try {
      await deleteOrganizationAction(orgId)
      toast.success(o.deletedToast, { id: toastId })
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error(o.deleteErrorToast, { id: toastId })
    } finally {
      setIsDeleting(false)
      setIsOpen(false)
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
        title={o.deleteTooltip}
      >
        <Trash2 className="w-5 h-5" />
      </button>

      <ConfirmModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        title={o.deleteModalTitle}
        description={o.deleteModalDesc.replace("{name}", orgName)}
        confirmText={o.confirmDelete}
        cancelText={t.common?.cancel || (isRTL ? "إلغاء" : "Cancel")}
        type="danger"
      />
    </>
  )
}
