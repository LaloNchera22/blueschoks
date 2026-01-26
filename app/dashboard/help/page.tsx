"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Mail, LifeBuoy, Settings, Package, Palette, Share2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface AccordionItemProps {
  title: string
  children: React.ReactNode
  isOpen: boolean
  onClick: () => void
  icon?: React.ReactNode
}

function AccordionItem({ title, children, isOpen, onClick, icon }: AccordionItemProps) {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white mb-3 shadow-sm transition-all hover:border-slate-300">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon && <div className="text-slate-500">{icon}</div>}
          <span className="font-semibold text-slate-900">{title}</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <div className="p-4 pt-0 text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Centro de Ayuda</h1>
        <p className="text-slate-500 text-lg">Domina tu tienda BlueShocks en 4 pasos</p>
      </div>

      {/* Accordion Section */}
      <div className="space-y-1">
        <AccordionItem
          title="1. Configura tu Identidad"
          isOpen={openIndex === 0}
          onClick={() => handleToggle(0)}
          icon={<Settings size={20} />}
        >
          Ve a <Link href="/dashboard/settings" className="font-medium text-blue-600 hover:underline">Configuración</Link> para editar nombre, logo y link de tu tienda.
        </AccordionItem>

        <AccordionItem
          title="2. Sube Productos"
          isOpen={openIndex === 1}
          onClick={() => handleToggle(1)}
          icon={<Package size={20} />}
        >
          En <Link href="/dashboard/products" className="font-medium text-blue-600 hover:underline">'Mis Productos'</Link> puedes agregar fotos ilimitadas y descripciones detalladas.
        </AccordionItem>

        <AccordionItem
          title="3. Personaliza"
          isOpen={openIndex === 2}
          onClick={() => handleToggle(2)}
          icon={<Palette size={20} />}
        >
          Usa la sección <Link href="/dashboard/design" className="font-medium text-blue-600 hover:underline">'Diseño'</Link> para elegir colores que representen tu marca.
        </AccordionItem>

        <AccordionItem
          title="4. Vende"
          isOpen={openIndex === 3}
          onClick={() => handleToggle(3)}
          icon={<Share2 size={20} />}
        >
          Copia tu Link único del menú y compártelo en Instagram o WhatsApp.
        </AccordionItem>
      </div>

      {/* Contact Card */}
      <Card className="bg-slate-50 border-slate-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
               <LifeBuoy className="w-6 h-6 text-blue-600" />
            </div>
            <div>
                <CardTitle className="text-xl">¿Necesitas asistencia técnica?</CardTitle>
                <CardDescription className="text-base mt-1">
                    Estamos aquí para ayudarte con cualquier problema de tu cuenta.
                </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">
             Si tienes dudas sobre facturación, problemas técnicos o sugerencias, estamos disponibles para ti.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild size="lg" className="w-full sm:w-auto font-bold bg-blue-600 hover:bg-blue-700">
            <a href="mailto:soporte@blueshocks.com">
              <Mail className="mr-2 w-4 h-4" />
              soporte@blueshocks.com
            </a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
