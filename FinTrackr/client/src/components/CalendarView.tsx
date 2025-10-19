import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from 'react-i18next';
import type { Transaction } from "@shared/schema";
import TransactionCard from "./TransactionCard";

interface CalendarViewProps {
  transactions: Transaction[];
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  formatCurrency: (amount: number | string) => string;
}

export default function CalendarView({ 
  transactions, 
  onEditTransaction, 
  onDeleteTransaction, 
  formatCurrency 
}: CalendarViewProps) {
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const transactionsByDate = useMemo(() => {
    const grouped: Record<string, Transaction[]> = {};
    transactions.forEach((transaction) => {
      const dateKey = transaction.date;
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(transaction);
    });
    return grouped;
  }, [transactions]);

  const getDailyTotal = (dateKey: string): number => {
    const dayTransactions = transactionsByDate[dateKey] || [];
    return dayTransactions.reduce((total, t) => {
      const amount = typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount;
      return total + (t.type === 'income' ? amount : -amount);
    }, 0);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };

  const handleDateClick = (day: number) => {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(selectedDate === dateKey ? null : dateKey);
  };

  const renderCalendarDays = () => {
    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-16" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const hasTransactions = transactionsByDate[dateKey]?.length > 0;
      const dailyTotal = getDailyTotal(dateKey);
      const isSelected = selectedDate === dateKey;
      const isToday = new Date().toISOString().split('T')[0] === dateKey;

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`h-16 p-1 rounded-lg border transition-all ${
            isSelected
              ? "bg-primary text-primary-foreground border-primary"
              : isToday
              ? "border-primary border-2"
              : "border-border hover:border-primary/50"
          }`}
        >
          <div className="text-sm font-semibold">{day}</div>
          {hasTransactions && (
            <div className={`text-xs mt-1 ${isSelected ? "text-primary-foreground" : dailyTotal >= 0 ? "text-chart-1" : "text-chart-2"}`}>
              {dailyTotal >= 0 ? "+" : ""}{formatCurrency(Math.abs(dailyTotal))}
            </div>
          )}
        </button>
      );
    }

    return days;
  };

  const selectedTransactions = selectedDate ? transactionsByDate[selectedDate] || [] : [];

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevMonth}
            >
              <ChevronLeft size={20} />
            </Button>
            <h3 className="text-lg font-semibold">
              {monthNames[month]} {year}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextMonth}
            >
              <ChevronRight size={20} />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div key={day} className="text-xs text-center font-semibold text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {renderCalendarDays()}
          </div>
        </CardContent>
      </Card>

      {selectedDate && (
        <Card>
          <CardContent className="p-4">
            <h4 className="text-md font-semibold mb-3">
              {t('transactionsOn')} {new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h4>
            
            {selectedTransactions.length > 0 ? (
              <div className="space-y-2">
                {selectedTransactions.map((transaction) => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                    onEdit={onEditTransaction}
                    onDelete={onDeleteTransaction}
                    formatCurrency={formatCurrency}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                {t('noTransactions')}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
