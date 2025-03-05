// src/components/ui/tabs.tsx
import React from 'react'
import { cn } from '@/lib/utils'

interface TabItem {
  id: string
  label: string
  disabled?: boolean
}

interface TabsProps {
  tabs: TabItem[]
  activeTab: string
  onChange: (tabId: string) => void
  className?: string
  tabsContainerClassName?: string
  tabClassName?: string
  activeTabClassName?: string
  disabledTabClassName?: string
  children?: React.ReactNode
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  className,
  tabsContainerClassName,
  tabClassName,
  activeTabClassName,
  disabledTabClassName,
  children,
}: TabsProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className={cn('border-b border-gray-200', tabsContainerClassName)}>
        <nav className='-mb-px flex space-x-8' aria-label='Tabs'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && onChange(tab.id)}
              className={cn(
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                tab.disabled &&
                  'opacity-50 cursor-not-allowed hover:text-gray-500 hover:border-transparent',
                tabClassName,
                activeTab === tab.id && activeTabClassName,
                tab.disabled && disabledTabClassName
              )}
              disabled={tab.disabled}
              aria-current={activeTab === tab.id ? 'page' : undefined}>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div>{children}</div>
    </div>
  )
}

interface TabPanelProps {
  id: string
  activeTab: string
  children: React.ReactNode
  className?: string
}

export function TabPanel({
  id,
  activeTab,
  children,
  className,
}: TabPanelProps) {
  if (id !== activeTab) return null

  return <div className={className}>{children}</div>
}
