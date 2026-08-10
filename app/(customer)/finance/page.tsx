"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Home, ChevronRight, Phone, FileText, CheckCircle, Car,
  Shield, Clock, ArrowRight, Calculator, User, Mail, MapPin,
  CreditCard, ChevronDown,
} from "lucide-react";

const steps = [
  { icon: Phone, step: "01", title: "Contact Us", desc: "Call or fill out the online form. Our finance team will reach out within 24 hours." },
  { icon: FileText, step: "02", title: "Submit Documents", desc: "Share your documents online or via WhatsApp — no showroom visit needed." },
  { icon: CheckCircle, step: "03", title: "Get Approved", desc: "Receive loan approval quickly from our partner banks & finance companies." },
  { icon: Car, step: "04", title: "Get Your Honda", desc: "Your Honda is delivered right to your doorstep after approval." },
];

const benefits = [
  { icon: Shield, title: "Secure Process", desc: "100% safe & secure document handling" },
  { icon: Clock, title: "Quick Approval", desc: "Approved within 24–48 hours" },
  { icon: Home, title: "From Home", desc: "No showroom visit required" },
  { icon: CreditCard, title: "Flexible EMI", desc: "Custom plans to suit your budget" },
];

const partners = [
  "Nepal SBI Bank", "NMB Bank", "Himalayan Bank", "Nabil Bank",
  "Global IME Bank", "Sanima Bank", "Century Bank", "Machhapuchchhre Bank",
];

/* ── EMI CALCULATOR ── */
function FinanceCalculator() {
  const [price, setPrice] = useState(350000);
  const [down, setDown] = useState(70000);
  const [rate, setRate] = useState(12);
  const [tenure, setTenure] = useState(24);
  const [tType, setTType] = useState("Mo");
  const [emi, setEmi] = useState(0);
  const [interest, setInterest] = useState(0);
  const [loan, setLoan] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const p = Math.max(0, price - down);
    if (!p) { setEmi(0); setInterest(0); setLoan(0); setTotal(0); return; }
    const r = rate / 12 / 100;
    const n = tType === "Yr" ? tenure * 12 : tenure;
    const e = r === 0 ? p / n : (p * r * Math.pow(1+r,n)) / (Math.pow(1+r,n)-1);
    setLoan(Math.round(p));
    setEmi(Math.round(e));
    setInterest(Math.round(e*n - p));
    setTotal(Math.round(e*n));
  }, [price, down, rate, tenure, tType]);

  const bg = (v: number, mn: number, mx: number) => {
    const p = Math.min(100, Math.max(0, ((v-mn)/(mx-mn))*100));
    return `linear-gradient(to right,#cc0000 ${p}%,#374151 ${p}%)`;
  };

  return (
    <div className="bg-[#f3ebdd] dark:bg-[#111] rounded-2xl overflow-hidden border border-[#f3ebdd]/5">
      <style>{`
        .fsl{-webkit-appearance:none;appearance:none;height:3px;width:100%;display:block;outline:none;cursor:pointer;border-radius:999px}
        .fsl::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:#cc0000;cursor:pointer;box-shadow:0 0 0 3px rgba(204,0,0,.2)}
        .fsl::-moz-range-thumb{width:16px;height:16px;border-radius:50%;background:#cc0000;border:none;cursor:pointer}
        input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none}
        input[type=number]{-moz-appearance:textfield}
      `}</style>
      <div className="bg-[#cc0000] px-8 py-5 flex items-center gap-3">
        <Calculator className="w-6 h-6 text-[#f3ebdd]"/>
        <h3 className="text-[#f3ebdd] font-bold text-xl">EMI Calculator</h3>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* inputs */}
        <div className="p-8 space-y-7 border-b lg:border-b-0 lg:border-r border-[#f3ebdd]/5">
          {[
            { label:"Vehicle Price (NPR)", val:price, set:setPrice, min:50000, max:2000000, step:10000 },
            { label:"Down Payment (NPR)", val:down, set:setDown, min:0, max:price, step:5000 },
          ].map(({label,val,set,min,max,step})=>(
            <div key={label}>
              <div className="flex justify-between mb-2">
                <label className="text-gray-400 text-sm">{label}</label>
                <input type="number" value={val} onChange={e=>set(Number(e.target.value))} className="bg-transparent border border-gray-600 text-[#f3ebdd] text-sm px-3 py-1 w-32 text-right outline-none focus:border-red-600 rounded"/>
              </div>
              <input type="range" min={min} max={max} step={step} value={val} onChange={e=>set(Number(e.target.value))} className="fsl" style={{background:bg(val,min,max)}}/>
            </div>
          ))}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-gray-400 text-sm">Interest Rate (%)</label>
              <input type="number" value={rate} step="0.5" onChange={e=>setRate(Number(e.target.value))} className="bg-transparent border border-gray-600 text-[#f3ebdd] text-sm px-3 py-1 w-20 text-right outline-none focus:border-red-600 rounded"/>
            </div>
            <input type="range" min="5" max="25" step="0.5" value={rate} onChange={e=>setRate(Number(e.target.value))} className="fsl" style={{background:bg(rate,5,25)}}/>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <label className="text-gray-400 text-sm flex-1">Loan Tenure</label>
              <div className="flex border border-gray-600 rounded overflow-hidden">
                {["Mo","Yr"].map(t=>(
                  <button key={t} onClick={()=>{setTType(t);setTenure(t==="Mo"?24:2);}}
                    className={`px-3 py-1 text-xs font-bold transition-colors ${tType===t?"bg-[#cc0000] text-[#f3ebdd]":"text-gray-400 hover:text-[#f3ebdd]"}`}>{t}</button>
                ))}
              </div>
              <input type="number" value={tenure} onChange={e=>setTenure(Number(e.target.value))} className="bg-transparent border border-gray-600 text-[#f3ebdd] text-sm px-3 py-1 w-16 text-center outline-none focus:border-red-600 rounded"/>
            </div>
            <input type="range" min={tType==="Mo"?6:1} max={tType==="Mo"?84:7} step="1" value={tenure} onChange={e=>setTenure(Number(e.target.value))} className="fsl" style={{background:bg(tenure,tType==="Mo"?6:1,tType==="Mo"?84:7)}}/>
          </div>
        </div>
        {/* results */}
        <div className="p-8 flex flex-col justify-between" style={{background:"linear-gradient(160deg,#3d0000,#0d0000)"}}>
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Monthly Payment</p>
            <p className="text-[#f3ebdd] font-black mb-6" style={{fontSize:"clamp(2.2rem,4vw,3.5rem)",lineHeight:1}}>
              NPR {emi.toLocaleString("en-IN")}
            </p>
            <div className="space-y-3 mb-6">
              {[["Loan Amount",loan],["Total Interest",interest],["Total Payable",total]].map(([l,v])=>(
                <div key={l} className="flex justify-between py-2 border-b border-[#f3ebdd]/10">
                  <span className="text-gray-400 text-sm">{l}</span>
                  <span className="text-[#f3ebdd] font-semibold tabular-nums text-sm">NPR {v.toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
            <div className="rounded-lg overflow-hidden h-2 flex mb-1">
              <div className="bg-[#cc0000] transition-all duration-500" style={{width:`${total>0?(loan/total)*100:0}%`}}/>
              <div className="bg-orange-500 flex-1"/>
            </div>
            <div className="flex gap-4 text-[10px] text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#cc0000] inline-block"/>Principal</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500 inline-block"/>Interest</span>
            </div>
          </div>
          <div className="mt-6">
            <p className="text-[9px] text-gray-600 mb-4 leading-relaxed">* Approximate calculation. Actual EMI may vary based on financial institution terms.</p>
            <a href="#apply" className="w-full block text-center bg-[#cc0000] hover:bg-[#aa0000] text-[#f3ebdd] font-bold py-3 rounded-full transition-colors">Apply for Finance</a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── APPLICATION FORM ── */
function ApplicationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({name:"",email:"",phone:"",city:"",model:"",message:""});
  const h = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm(p=>({...p,[e.target.name]:e.target.value}));
  const ic = "w-full bg-[#f3ebdd]/5 border border-[#f3ebdd]/10 text-[#f3ebdd] px-4 py-3 rounded-lg outline-none focus:border-red-600 transition-colors placeholder-gray-600 text-sm";
  const lc = "block text-gray-400 text-xs uppercase tracking-wider mb-1.5";

  if (submitted) return (
    <div className="flex flex-col items-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
        <CheckCircle className="w-10 h-10 text-green-400"/>
      </div>
      <h3 className="text-2xl font-bold text-[#f3ebdd] mb-2">Application Submitted!</h3>
      <p className="text-gray-400 max-w-sm">Our finance team will contact you within 24 hours.</p>
      <button onClick={()=>setSubmitted(false)} className="mt-8 text-red-400 hover:text-red-300 text-sm">Submit another</button>
    </div>
  );

  return (
    <form onSubmit={e=>{e.preventDefault();setSubmitted(true);}} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div><label className={lc}>Full Name *</label>
          <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"/>
            <input required name="name" value={form.name} onChange={h} placeholder="Your full name" className={ic+" pl-10"}/></div></div>
        <div><label className={lc}>Email *</label>
          <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"/>
            <input required type="email" name="email" value={form.email} onChange={h} placeholder="you@example.com" className={ic+" pl-10"}/></div></div>
        <div><label className={lc}>Phone *</label>
          <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"/>
            <input required name="phone" value={form.phone} onChange={h} placeholder="98XXXXXXXX" className={ic+" pl-10"}/></div></div>
        <div><label className={lc}>City / District *</label>
          <div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"/>
            <input required name="city" value={form.city} onChange={h} placeholder="Kathmandu" className={ic+" pl-10"}/></div></div>
      </div>
      <div><label className={lc}>Honda Model *</label>
        <div className="relative">
          <select required name="model" value={form.model} onChange={h} className={ic+" appearance-none pr-10"}>
            <option value="" disabled>Select a model</option>
            <optgroup label="Motorcycles">
              <option>Honda NX 200</option><option>Honda CB Hornet 2.0</option>
              <option>Honda SP 125</option><option>Honda CB Shine</option>
            </optgroup>
            <optgroup label="Scooters">
              <option>Honda Dio 125</option><option>Honda Activa 6G</option>
            </optgroup>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"/>
        </div>
      </div>
      <div><label className={lc}>Additional Message</label>
        <textarea name="message" value={form.message} onChange={h} rows={4} placeholder="Any specific requirements..." className={ic+" resize-none"}/></div>
      <p className="text-[10px] text-gray-600">By submitting, you agree to be contacted by our finance team. Your data is kept confidential.</p>
      <button type="submit" className="w-full bg-[#cc0000] hover:bg-[#aa0000] text-[#f3ebdd] font-bold py-4 rounded-full transition-colors flex items-center justify-center gap-2">
        Submit Finance Application <ArrowRight className="w-4 h-4"/>
      </button>
    </form>
  );
}

/* ── PAGE ── */
export default function FinancePage() {
  return (
    <main className="bg-black text-[#f3ebdd] min-h-screen">

      {/* HOW IT WORKS */}
      <section className="py-20 px-8 lg:px-16 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#cc0000] text-xs font-bold tracking-widest uppercase mb-3">Simple Process</p>
            <h2 className="text-4xl font-black text-[#f3ebdd]">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({icon:Icon,step,title,desc},i)=>(
              <div key={i} className="bg-[#f3ebdd]/3 border border-[#f3ebdd]/8 rounded-2xl p-6 hover:border-red-600/40 transition-colors">
                <div className="w-12 h-12 rounded-full bg-[#cc0000]/10 border border-[#cc0000]/30 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[#cc0000]"/>
                </div>
                <span className="text-[#cc0000] font-black text-3xl block mb-1">{step}</span>
                <h3 className="text-[#f3ebdd] font-bold text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-16 px-8 lg:px-16">
         <div className="text-center mb-14">
            <p className="text-[#cc0000] text-xs font-bold tracking-widest uppercase mb-3">Simple Process</p>
            <h2 className="text-4xl font-black text-[#f3ebdd]">Benefits of Finance</h2>
          </div>
          <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-5">
          {benefits.map(({icon:Icon,title,desc},i)=>(
            <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl border border-[#f3ebdd]/8 bg-[#f3ebdd]/3 hover:border-red-600/30 transition-colors">
              <div className="w-14 h-14 rounded-full bg-[#cc0000]/10 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-[#cc0000]"/>
              </div>
              <h3 className="text-[#f3ebdd] font-bold mb-1">{title}</h3>
              <p className="text-gray-500 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CALCULATOR */}
      <section id="calculator" className="py-20 px-8 lg:px-16 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#cc0000] text-xs font-bold tracking-widest uppercase mb-3">Finance Tools</p>
            <h2 className="text-4xl font-black text-[#f3ebdd]">EMI Calculator</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Estimate your monthly installment. Adjust the sliders to find a plan that fits your budget.</p>
          </div>
          <FinanceCalculator/>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="py-16 px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[#cc0000] text-xs font-bold tracking-widest uppercase mb-3">Our Partners</p>
            <h2 className="text-3xl font-black text-[#f3ebdd]">Finance Partners</h2>
            <p className="text-gray-500 mt-2">Leading banks & financial institutions across Nepal</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {partners.map((b,i)=>(
              <div key={i} className="border border-[#f3ebdd]/8 rounded-xl px-5 py-4 text-center text-[#f3ebdd]/70 text-sm font-medium hover:border-red-600/40 hover:text-[#f3ebdd] transition-colors bg-[#f3ebdd]/2">{b}</div>
            ))}
          </div>
        </div>
      </section>

      {/* APPLICATION FORM */}
      <section id="apply" className="py-20 px-8 lg:px-16 bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#cc0000] text-xs font-bold tracking-widest uppercase mb-3">Get Started</p>
            <h2 className="text-4xl font-black text-[#f3ebdd]">Apply for Finance</h2>
            <p className="text-gray-500 mt-3">Fill in your details and our team will contact you within 24 hours.</p>
          </div>
          <div className="bg-[#f3ebdd] dark:bg-[#111] border border-[#f3ebdd]/5 rounded-2xl p-8">
            <ApplicationForm/>
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="py-14 px-8 lg:px-16 bg-[#cc0000]">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-[#f3ebdd] font-black text-2xl lg:text-3xl">Need help choosing a model?</h3>
            <p className="text-red-200 mt-1">Our team is ready to guide you to your perfect Honda.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link href="/vehicles" className="bg-[#f3ebdd] text-[#cc0000] font-bold px-6 py-3 rounded-full hover:bg-[#e8dfd1] transition-colors text-sm">Browse Models</Link>
            <a href="tel:+977-1-XXXXXXX" className="border border-[#f3ebdd] text-[#f3ebdd] font-bold px-6 py-3 rounded-full hover:bg-[#f3ebdd]/10 transition-colors text-sm flex items-center gap-2">
              <Phone className="w-4 h-4"/>Call Us
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
