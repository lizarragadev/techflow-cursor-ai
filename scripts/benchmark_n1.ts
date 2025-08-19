/**
 * Script para medir el impacto del problema N+1 y sus optimizaciones
 */

import { 
  fetchOrdersDetailed_NPlus1,
  fetchOrdersDetailed_Batched,
  fetchOrdersDetailed_Joined
} from '../src/orders/repository.js';

async function benchmarkMethods(limit: number) {
  console.log(`\n📊 Benchmarking orders fetch methods (limit: ${limit})...\n`);
  
  // N+1 method
  const startN1 = performance.now();
  const n1Data = await fetchOrdersDetailed_NPlus1(limit);
  const endN1 = performance.now();
  const n1Time = Math.round(endN1 - startN1);
  console.log(`❌ N+1 method: ${n1Time}ms - ${1 + (2 * limit)} queries total`);
  
  // Batched method
  const startBatched = performance.now();
  const batchedData = await fetchOrdersDetailed_Batched(limit);
  const endBatched = performance.now();
  const batchedTime = Math.round(endBatched - startBatched);
  
  // Joined method
  const startJoined = performance.now();
  const joinedData = await fetchOrdersDetailed_Joined(limit);
  const endJoined = performance.now();
  const joinedTime = Math.round(endJoined - startJoined);
  
  const batchedImprovement = `${Math.round(((n1Time - batchedTime) / n1Time) * 100)}% faster`;
  const joinedImprovement = `${Math.round(((n1Time - joinedTime) / n1Time) * 100)}% faster`;
  
  console.log(`\n🎯 Performance Summary:`);
  console.log(`   Batched is ${batchedImprovement} than N+1`);
  console.log(`   Joined is ${joinedImprovement} than N+1`);
  console.log(`   Records processed: ${n1Data.length}\n`);
  
  return {
    n1Results: { data: n1Data, timeMs: n1Time },
    batchedResults: { data: batchedData, timeMs: batchedTime },
    joinedResults: { data: joinedData, timeMs: joinedTime },
    improvement: { 
      batchedVsN1: batchedImprovement, 
      joinedVsN1: joinedImprovement 
    }
  };
}

async function runBenchmarks() {
  console.log('🚀 Iniciando benchmarks para eliminar N+1...\n');
  
  // Test con diferentes tamaños de datos
  const testSizes = [10, 25, 50];
  
  for (const limit of testSizes) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📈 Testing with ${limit} orders`);
    console.log(`${'='.repeat(60)}`);
    
    try {
      const results = await benchmarkMethods(limit);
      
      console.log(`\n📊 Detailed Results:`);
      console.log(`   N+1 Method:     ${results.n1Results.timeMs}ms`);
      console.log(`   Batched Method: ${results.batchedResults.timeMs}ms`);
      console.log(`   Joined Method:  ${results.joinedResults.timeMs}ms`);
      
      console.log(`\n🎯 Improvements:`);
      console.log(`   Batched: ${results.improvement.batchedVsN1}`);
      console.log(`   Joined:  ${results.improvement.joinedVsN1}`);
      
      // Verificar que los resultados son iguales
      const n1Count = results.n1Results.data.length;
      const batchedCount = results.batchedResults.data.length;
      const joinedCount = results.joinedResults.data.length;
      
      if (n1Count === batchedCount && batchedCount === joinedCount) {
        console.log(`   ✅ All methods returned ${n1Count} records`);
      } else {
        console.log(`   ❌ Inconsistent results: N+1=${n1Count}, Batched=${batchedCount}, Joined=${joinedCount}`);
      }
      
    } catch (error) {
      console.error(`❌ Error testing with ${limit} orders:`, error);
    }
  }
  
  console.log(`\n${'='.repeat(60)}`);
  console.log('📋 ANÁLISIS DEL IMPACTO ESPERADO');
  console.log(`${'='.repeat(60)}`);
  
  console.log(`
🔍 PROBLEMA N+1 IDENTIFICADO:
   • Método original: 1 + (2 × N) queries
   • Para 50 órdenes: 1 + (2 × 50) = 101 queries total
   • Latencia: ~3ms + (50 × 2ms) + (50 × 2ms) = ~203ms

🚀 OPTIMIZACIÓN 1 - BATCHING:
   • Consultas en lote: 3 queries total (orders + products + categories)
   • Latencia esperada: ~9ms total
   • Mejora: ~95% reducción en tiempo
   • Reduce queries de O(N) a O(1)

🚀 OPTIMIZACIÓN 2 - JOIN:
   • Una sola query con JOIN completo
   • Latencia esperada: ~5ms total
   • Mejora: ~97% reducción en tiempo
   • Máxima eficiencia: 1 query vs 101 queries

💡 IMPACTO EN PRODUCCIÓN:
   • Menor carga en base de datos
   • Mejor tiempo de respuesta para usuarios
   • Mayor escalabilidad del sistema
   • Reducción significativa en costos de infraestructura
  `);
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runBenchmarks().catch(console.error);
}

export { runBenchmarks };
