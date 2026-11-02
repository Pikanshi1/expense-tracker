import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { addExpense } from "../services/expenseService";
import { FaArrowLeft, FaMapMarkerAlt, FaReceipt } from "react-icons/fa";
import { toast } from "react-toastify";

export default function AddExpense() {
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState(null);
  const [location, setLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: { type: "Expense", date: new Date().toISOString().slice(0,16) } });
  const captureLocation = () => {
    if (!navigator.geolocation) return toast.error("Location is not supported by this browser.");
    setLocating(true);
    navigator.geolocation.getCurrentPosition(position => {
      setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude, label: "Location captured" });
      setLocating(false); toast.success("Location added to this transaction.");
    }, () => { setLocating(false); toast.error("Location permission was not granted."); }, { enableHighAccuracy: false, timeout: 10000 });
  };
  const onSubmit = async values => {
    try {
      const payload = receipt || location ? new FormData() : values;
      if (payload instanceof FormData) {
        Object.entries(values).forEach(([key,value]) => payload.append(key, value));
        if (receipt) payload.append("receipt", receipt);
        if (location) payload.append("location", JSON.stringify(location));
      }
      await addExpense(payload);
      toast.success("Transaction added successfully."); navigate("/expenses");
    } catch (error) { toast.error(error.response?.data?.message || "Failed to add transaction."); }
  };
  return <DashboardLayout><div className="flex items-center gap-3 mb-6"><button onClick={()=>navigate("/expenses")} className="muted-copy hover:text-blue-500" title="Back"><FaArrowLeft size={20}/></button><div><p className="eyebrow">CAPTURE A MONEY MOMENT</p><h1 className="display-heading">Add transaction</h1></div></div>
    <form onSubmit={handleSubmit(onSubmit)} className="app-card max-w-2xl space-y-5">
      <div><label className="block mb-2 text-sm font-semibold">Title</label><input type="text" placeholder="e.g. Grocery shopping" className="w-full border rounded-xl p-3" {...register("title",{required:"Title is required",maxLength:{value:100,message:"Keep the title under 100 characters."}})}/><p className="text-rose-500 text-sm">{errors.title?.message}</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label className="block mb-2 text-sm font-semibold">Amount (INR)</label><input type="number" min="0.01" step="0.01" placeholder="0.00" className="w-full border rounded-xl p-3" {...register("amount",{required:"Amount is required",min:{value:0.01,message:"Amount must be positive."},valueAsNumber:true})}/><p className="text-rose-500 text-sm">{errors.amount?.message}</p></div><div><label className="block mb-2 text-sm font-semibold">Date and time</label><input type="datetime-local" className="w-full border rounded-xl p-3" {...register("date",{required:"Date is required"})}/></div></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label className="block mb-2 text-sm font-semibold">Category</label><select className="w-full border rounded-xl p-3" {...register("category",{required:"Category is required"})}><option value="">Select category</option>{["Food","Travel","Shopping","Bills","Entertainment","Education","Health","Salary","Other"].map(x=><option key={x}>{x}</option>)}</select><p className="text-rose-500 text-sm">{errors.category?.message}</p></div><div><label className="block mb-2 text-sm font-semibold">Type</label><select className="w-full border rounded-xl p-3" {...register("type",{required:true})}><option value="Expense">Expense</option><option value="Income">Income</option></select></div></div>
      <div><label className="block mb-2 text-sm font-semibold">Description</label><textarea rows="2" placeholder="What was this transaction for?" className="w-full border rounded-xl p-3" {...register("description")}/></div>
      <div><label className="block mb-2 text-sm font-semibold">Notes (optional)</label><textarea rows="2" placeholder="Add a private note to remember the details…" className="w-full border rounded-xl p-3" {...register("notes")}/></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><label className="flex items-center gap-3 rounded-xl border p-4 cursor-pointer"><FaReceipt className="text-violet-400"/><span className="min-w-0 flex-1"><strong className="block text-sm">Attach receipt</strong><small className="muted-copy">JPG, PNG or WebP · max 5 MB</small>{receipt&&<small className="block text-emerald-500 truncate">{receipt.name}</small>}</span><input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={e=>setReceipt(e.target.files?.[0]||null)}/></label><button type="button" onClick={captureLocation} className="flex items-center gap-3 rounded-xl border p-4 text-left"><FaMapMarkerAlt className="text-rose-400"/><span><strong className="block text-sm">{locating?"Getting location…":location?"Location attached":"Add location"}</strong><small className="muted-copy">Optional · only when you choose</small></span></button></div>
      <p className="muted-copy text-xs">Receipt images are attached for your reference. Automatic receipt text extraction is not enabled in this version; check the receipt and enter the details above.</p>
      <button type="submit" className="gradient-button w-full">Save transaction</button>
    </form>
  </DashboardLayout>;
}
