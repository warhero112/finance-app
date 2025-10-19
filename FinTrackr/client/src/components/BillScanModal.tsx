import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Upload, FileText } from "lucide-react";
import { useTranslation } from 'react-i18next';

interface BillScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function BillScanModal({ isOpen, onClose, onSubmit }: BillScanModalProps) {
  const { t } = useTranslation();
  const [scanMethod, setScanMethod] = useState<'upload' | 'manual' | null>(null);
  const [amount, setAmount] = useState("");
  const [merchant, setMerchant] = useState("");
  const [category, setCategory] = useState("Shopping");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = () => {
    if (!amount || parseFloat(amount) <= 0) {
      return;
    }

    onSubmit({
      amount,
      category,
      type: "expense",
      date,
      notes: merchant ? `${t('billFrom')} ${merchant}` : t('scannedBill')
    });

    setAmount("");
    setMerchant("");
    setCategory("Shopping");
    setDate(new Date().toISOString().split('T')[0]);
    setScanMethod(null);
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      alert(t('ocrAlert'));
      setScanMethod('manual');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('scanBill')}</DialogTitle>
        </DialogHeader>

        {!scanMethod ? (
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">{t('chooseBillMethod')}</p>
            
            <div className="grid gap-3">
              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2"
                onClick={() => document.getElementById('bill-upload')?.click()}
              >
                <Camera size={24} />
                <span>{t('takePhoto')}</span>
              </Button>
              <input
                id="bill-upload"
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleImageUpload}
              />

              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2"
                onClick={() => setScanMethod('manual')}
              >
                <FileText size={24} />
                <span>{t('enterManually')}</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">{t('amount')} *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="merchant">{t('merchant')}</Label>
              <Input
                id="merchant"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                placeholder={t('merchantPlaceholder')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">{t('category')}</Label>
              <select
                id="category"
                className="w-full border border-border rounded-lg px-3 py-2 bg-background"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Food">{t('food')}</option>
                <option value="Transportation">{t('transportation')}</option>
                <option value="Shopping">{t('shopping')}</option>
                <option value="Bills">{t('bills')}</option>
                <option value="Other">{t('other')}</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">{t('date')}</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setScanMethod(null);
                  setAmount("");
                  setMerchant("");
                }}
              >
                {t('cancel')}
              </Button>
              <Button
                className="flex-1"
                onClick={handleSubmit}
                disabled={!amount || parseFloat(amount) <= 0}
              >
                {t('save')}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
