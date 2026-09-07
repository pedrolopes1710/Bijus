import { redirect } from "next/navigation"

// A gestão foi consolidada no /backoffice. Mantém-se este redirect por retrocompatibilidade.
export default function AdminPage() {
  redirect("/backoffice")
}
