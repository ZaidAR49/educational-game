import { auth } from "@/auth"

export default async function DashboardPage() {
  const session = await auth()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pt-32">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">لوحة التحكم</h1>
        <p className="text-gray-600 mb-6">
          مرحباً بك يا <span className="font-bold text-emerald-600">{session?.user?.name}</span>!
        </p>
        <p className="text-sm text-gray-500">
          هذه لوحة تحكم مؤقتة فارغة. سيتم إضافة الميزات قريباً.
        </p>
      </div>
    </div>
  )
}
