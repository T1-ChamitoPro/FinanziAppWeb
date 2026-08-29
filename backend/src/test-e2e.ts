async function runTests() {
  const BASE_URL = 'http://localhost:8080/api';
  const timestamp = Date.now();
  const testUser = {
    nombre: 'Usuario Prueba',
    correo: `test_${timestamp}@ejemplo.com`,
    contrasena: 'Password123!',
  };

  console.log('🧪 Iniciando batería de pruebas E2E en', BASE_URL);

  // 1. Health Check
  console.log('\n1. Test GET /health');
  const resHealth = await fetch(`${BASE_URL}/health`);
  const healthData = await resHealth.json();
  console.log('  Status:', resHealth.status, 'Data:', healthData);
  if (resHealth.status !== 200) throw new Error('Health check falló');

  // 2. Categorías
  console.log('\n2. Test GET /categorias');
  const resCat = await fetch(`${BASE_URL}/categorias`);
  const categorias: any = await resCat.json();
  console.log(`  Categorías encontradas: ${categorias.length}`);
  if (!Array.isArray(categorias) || categorias.length === 0) throw new Error('Categorías no encontradas');

  const catIngreso = categorias.find((c: any) => c.tipo === 'INGRESO');
  const catGasto = categorias.find((c: any) => c.tipo === 'GASTO');

  console.log('\n3. Test GET /categorias/tipo/INGRESO');
  const resCatIngreso = await fetch(`${BASE_URL}/categorias/tipo/INGRESO`);
  const ingresos: any = await resCatIngreso.json();
  console.log(`  Ingresos encontrados: ${ingresos.length}`);

  console.log('\n4. Test POST /categorias (Crear categoría personalizada)');
  const resCrearCat = await fetch(`${BASE_URL}/categorias`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre: `Test Cat ${timestamp}`, tipo: 'GASTO' }),
  });
  const nuevaCat: any = await resCrearCat.json();
  console.log('  Status:', resCrearCat.status, 'Creada:', nuevaCat.nombre);
  if (resCrearCat.status !== 201) throw new Error('Crear categoría falló');

  // 3. Autenticación
  console.log('\n5. Test POST /auth/register');
  const resReg = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testUser),
  });
  const regData: any = await resReg.json();
  console.log('  Status:', resReg.status, 'Data:', regData);
  if (resReg.status !== 201 || !regData.idUsuario) throw new Error('Registro falló');
  const idUsuario = regData.idUsuario;

  console.log('\n6. Test POST /auth/register (Duplicado)');
  const resRegDup = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testUser),
  });
  console.log('  Status (Esperado 400):', resRegDup.status);
  if (resRegDup.status !== 400) throw new Error('Validación de correo duplicado falló');

  console.log('\n7. Test POST /auth/login (Correcto)');
  const resLogin = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo: testUser.correo, contrasena: testUser.contrasena }),
  });
  const loginData: any = await resLogin.json();
  console.log('  Status:', resLogin.status, 'Mensaje:', loginData.message);
  if (resLogin.status !== 200 || loginData.idUsuario !== idUsuario) throw new Error('Login correcto falló');

  console.log('\n8. Test POST /auth/login (Contraseña incorrecta)');
  const resLoginFail = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo: testUser.correo, contrasena: 'WrongPassword' }),
  });
  console.log('  Status (Esperado 401):', resLoginFail.status);
  if (resLoginFail.status !== 401) throw new Error('Login fallido falló');

  // 4. Transacciones
  console.log('\n9. Test POST /transacciones (Ingreso $500,000)');
  const resT1 = await fetch(`${BASE_URL}/transacciones`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      monto: 500000,
      descripcion: 'Pago de nómina test',
      fecha: '2026-08-28',
      idUsuario: idUsuario,
      idCategoria: catIngreso.idCategoria,
    }),
  });
  const t1Data: any = await resT1.json();
  console.log('  Status:', resT1.status, 'ID Transacción:', t1Data.idTransaccion);
  if (resT1.status !== 201) throw new Error('Crear ingreso falló');

  console.log('\n10. Test POST /transacciones (Gasto $150,000)');
  const resT2 = await fetch(`${BASE_URL}/transacciones`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      monto: 150000,
      descripcion: 'Compra supermercado test',
      fecha: '2026-08-28',
      idUsuario: idUsuario,
      idCategoria: catGasto.idCategoria,
    }),
  });
  const t2Data: any = await resT2.json();
  console.log('  Status:', resT2.status, 'ID Transacción:', t2Data.idTransaccion);
  if (resT2.status !== 201) throw new Error('Crear gasto falló');

  console.log('\n11. Test GET /transacciones/usuario/:idUsuario');
  const resUserT = await fetch(`${BASE_URL}/transacciones/usuario/${idUsuario}`);
  const userTransacciones: any = await resUserT.json();
  console.log(`  Transacciones encontradas para usuario: ${userTransacciones.length}`);
  if (userTransacciones.length !== 2) throw new Error('Listar transacciones falló');

  console.log('\n12. Test GET /transacciones/balance/usuario/:idUsuario');
  const resBalance = await fetch(`${BASE_URL}/transacciones/balance/usuario/${idUsuario}`);
  const balanceData: any = await resBalance.json();
  console.log('  Balance:', balanceData);
  if (
    balanceData.totalIngresos !== 500000 ||
    balanceData.totalGastos !== 150000 ||
    balanceData.balanceTotal !== 350000
  ) {
    throw new Error('Cálculo de balance falló');
  }

  console.log('\n13. Test PUT /transacciones/:id (Actualizar gasto a $200,000)');
  const resPut = await fetch(`${BASE_URL}/transacciones/${t2Data.idTransaccion}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      monto: 200000,
      descripcion: 'Compra supermercado editada',
      fecha: '2026-08-28',
      idCategoria: catGasto.idCategoria,
    }),
  });
  const putData: any = await resPut.json();
  console.log('  Status:', resPut.status, 'Nuevo monto:', putData.monto);
  if (resPut.status !== 200 || putData.monto !== 200000) throw new Error('Actualizar transacción falló');

  console.log('\n14. Test DELETE /transacciones/:id (Eliminar gasto)');
  const resDel = await fetch(`${BASE_URL}/transacciones/${t2Data.idTransaccion}`, {
    method: 'DELETE',
  });
  console.log('  Status (Esperado 204):', resDel.status);
  if (resDel.status !== 204) throw new Error('Eliminar transacción falló');

  console.log('\n15. Test Recalcular balance tras eliminación');
  const resBalanceFinal = await fetch(`${BASE_URL}/transacciones/balance/usuario/${idUsuario}`);
  const balanceFinal: any = await resBalanceFinal.json();
  console.log('  Balance final:', balanceFinal);
  if (balanceFinal.totalGastos !== 0 || balanceFinal.balanceTotal !== 500000) {
    throw new Error('Balance final tras eliminación erróneo');
  }

  console.log('\n🎉 ¡TODAS LAS PRUEBAS E2E (15/15) PASARON EXITOSAMENTE!');
}

runTests().catch((err) => {
  console.error('\n❌ ERROR EN PRUEBAS:', err.message);
  process.exit(1);
});
