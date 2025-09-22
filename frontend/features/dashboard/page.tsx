"use client"

import { Gantt, Task, ViewMode } from "gantt-task-react"
import "gantt-task-react/dist/index.css"

import { useEffect, useState } from "react"
import {
  Tabs, TabsList, TabsTrigger, TabsContent
} from "@/components/ui/tabs"

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts"

import { fetchIndicadores } from "../indicadores/indicadoresAPI"

import { fetchEntregaveis } from "../entregaveis/entregaveisAPI"

import { fetchActivities } from "@/features/tasks/api"

export default function DashboardsPage() {
  const [indicadores, setIndicadores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedIndicador, setSelectedIndicador] = useState<any | null>(null)

  const [entregaveis, setEntregaveis] = useState<Task[]>([])

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchIndicadores()
        setIndicadores(data)
        if (data.length > 0) setSelectedIndicador(data[0])
      } catch {
        setError("Error loading indicators.")
      } finally {
        setLoading(false)
      }
    }
    load()


    async function loadEntregaveis() {
      try {
        const [entregaveisData, atividadesData] = await Promise.all([
          fetchEntregaveis(),
          fetchActivities()
        ]);

        const tasks: Task[] = [];

        // Para cada atividade (projeto), adiciona a atividade e depois os entregáveis relacionados
        atividadesData.forEach((atividade: any) => {
          const startAtividade = new Date(atividade.dataInicioAtividade);
          const endAtividade = new Date(atividade.dataFimAtividade);

          // Adiciona a atividade como projeto
          tasks.push({
            id: atividade.id,
            name: `Activity: ${atividade.nomeAtividade}`,
            type: "project",
            start: startAtividade,
            end: endAtividade,
            progress: 0,
            isDisabled: false,
            styles: {
              backgroundColor: "#bfdbfe"
            }
          });

          // Filtra os entregáveis que pertencem a esta atividade
          const entregaveisDaAtividade = entregaveisData.filter(
            (entregavel: any) => entregavel.atividadeId === atividade.id
          );

          // Adiciona os entregáveis abaixo da atividade
          entregaveisDaAtividade.forEach((entregavel: any) => {
            const startEntregavel = new Date(entregavel.data);
            const endEntregavel = new Date(startEntregavel);

            tasks.push({
              id: entregavel.id,
              name: `Deliverable: ${entregavel.nome}`,
              type: "task",
              start: startEntregavel,
              end: endEntregavel,
              project: atividade.id,
              progress: 0,
              isDisabled: false,
              styles: {
                progressColor: "#2563eb",
                backgroundColor: "#c7d2fe"
              }
            });
          });
        });

        setEntregaveis(tasks);
      } catch (err) {
        console.error("Erro ao carregar entregáveis e atividades:", err);
      }
    }

    loadEntregaveis()

  }, [])

  const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444"]

  const getPieData = (indicador: any) => [
    { name: "Completed", value: indicador.valorAtual },
    { name: "Pending", value: indicador.valorMaximo - indicador.valorAtual }
  ]

  if (loading) return <Loader />
  if (error) return <Error message={error} />

  return (
    <div className="max-w-7xl mx-auto px-8 py-12 bg-gray-50 min-h-screen">
      <header className="mb-12 text-left">
      </header>

      <Tabs defaultValue="indicators" className="bg-white rounded-lg shadow-lg">
        <TabsList className="border-b border-gray-200 bg-gray-100 px-6 py-3 rounded-t-lg flex justify-center gap-8 text-gray-700 font-semibold text-lg">
          <TabsTrigger value="indicators" className="hover:text-indigo-600 focus:text-indigo-700">
            📊 Indicators
          </TabsTrigger>
          <TabsTrigger value="deliverables" className="hover:text-indigo-600 focus:text-indigo-700">
            📦 Deliverables
          </TabsTrigger>
        </TabsList>

        {/* INDICATORS TAB */}
        <TabsContent value="indicators" className="px-10 py-8 space-y-12">
          <section>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b border-gray-300 pb-3">
              Indicators Overview
            </h2>

            <div className="cursor-pointer">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={indicadores}
                  margin={{ top: 15, right: 40, left: 20, bottom: 60 }}
                  onClick={(e) => {
                    if (e && e.activePayload && e.activePayload.length > 0) {
                      setSelectedIndicador(e.activePayload[0].payload)
                    }
                  }}
                >
                  <XAxis
                    dataKey="nome"
                    tick={{ fill: "#4b5563", fontWeight: "600", fontSize: 14 }}
                    interval={0}
                    angle={-40}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis
                    tick={{ fill: "#4b5563", fontSize: 14 }}
                    width={55}
                    tickFormatter={(val) => val.toLocaleString()}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#111827", borderRadius: 8, border: "none" }}
                    labelStyle={{ color: "#f9fafb", fontWeight: "700" }}
                    itemStyle={{ color: "#d1d5db" }}
                  />
                  <Bar dataKey="valorAtual" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <p className="mt-4 text-center text-gray-500 italic select-none">
              Click on a bar to see indicator details.
            </p>
          </section>

          {/* Detailed Indicator Panel */}
          {selectedIndicador && (
            <section className="bg-gray-100 rounded-lg p-8 shadow-md max-w-5xl mx-auto">
              <h3 className="text-3xl font-semibold mb-10 text-gray-900 border-b border-gray-300 pb-4">
                {selectedIndicador.nome} - Details
              </h3>

              <div className="flex flex-col md:flex-row justify-center gap-14">
                <Card style={{ maxWidth: 350, flex: 1 }}>
                  <h4 className="text-xl font-semibold mb-6 text-center text-gray-800">
                    Current Progress
                  </h4>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={getPieData(selectedIndicador)}
                        dataKey="value"
                        innerRadius={60}
                        outerRadius={90}
                        startAngle={90}
                        endAngle={-270}
                        paddingAngle={5}
                      >
                        {getPieData(selectedIndicador).map((_, i) => (
                          <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        wrapperStyle={{ fontSize: 14, color: "#374151" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <p className="text-center text-gray-600 mt-4 text-lg font-medium tracking-wide">
                    {(selectedIndicador.valorAtual / selectedIndicador.valorMaximo * 100).toFixed(1)}% completed
                  </p>
                </Card>

                <Card style={{ maxWidth: 350, flex: 1 }}>
                  <h4 className="text-xl font-semibold mb-6 text-center text-gray-800">
                    Current vs Maximum Value
                  </h4>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart
                      data={[selectedIndicador]}
                      margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                    >
                      <XAxis dataKey="nome" hide />
                      <YAxis
                        domain={[0, selectedIndicador.valorMaximo]}
                        tick={{ fill: "#4b5563", fontSize: 14 }}
                        width={50}
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#111827", borderRadius: 8, border: "none" }}
                        labelStyle={{ color: "#f9fafb", fontWeight: "700" }}
                        itemStyle={{ color: "#d1d5db" }}
                      />
                      <Bar dataKey="valorAtual" fill="#10b981" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="valorMaximo" fill="#fbbf24" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            </section>
          )}
        </TabsContent>

        {/* DELIVERABLES TAB */}
        <TabsContent value="deliverables" className="px-10 py-8 space-y-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b border-gray-300 pb-3">
            Deliverables Schedule
          </h2>

          {entregaveis.length > 0 ? (
            <div className="bg-white p-4 rounded-lg shadow">
              <Gantt
                tasks={entregaveis}
                viewMode={ViewMode.Week}
                listCellWidth="155px"
                columnWidth={65}
                barFill={60}

              />
            </div>
          ) : (
            <Loader />
          )}
        </TabsContent>

      </Tabs>
    </div>
  )
}

function Card({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`bg-white rounded-lg p-6 ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}


function Loader() {
  return (
    <div className="flex justify-center items-center h-48">
      <p className="text-gray-500 text-lg animate-pulse">Loading dashboards...</p>
    </div>
  )
}

function Error({ message }: { message: string }) {
  return (
    <div className="flex justify-center items-center h-48">
      <p className="text-red-600 text-lg font-semibold">{message}</p>
    </div>
  )
}
