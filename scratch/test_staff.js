fetch("http://localhost:3000/api/admin/settings/staff", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Test Staff",
    phone: "12345",
    role: "STAFF",
    accountNo: "123",
    panNo: "123",
    lastSalary: "1000",
    order: "1"
  })
}).then(res => res.json()).then(console.log);
