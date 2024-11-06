
// import pool from '@/lib/db/db'
import fs from 'fs'
async function handler(request: Request) {
  // const { searchParams } = new URL(request.url);
  // const query = Object.fromEntries(searchParams.entries());

  // // const client = await pool.connect();
  // const result = await client.query(query.sqlQuery);
  // const columns = result.fields.map(field => field.name);
  // const rows = result.rows;

  // Format response
  const response = {
    // columns,
    // rows,
  };
  //   const tablesQuery = `
  //   SELECT table_name
  //   FROM information_schema.tables
  //   WHERE table_schema = 'public'
  // `;
  // const tablesResult = await client.query(tablesQuery);
  // const tables = tablesResult.rows;

  // const schemaInfo = await Promise.all(
  //   tables.map(async (table: { table_name: string }) => {
  //     const columnsQuery = `
  //       SELECT column_name, data_type, is_nullable
  //       FROM information_schema.columns
  //       WHERE table_name = $1
  //     `;
  //     const columnsResult = await client.query(columnsQuery, [table.table_name]);
  //     return {
  //       table: table.table_name,
  //       columns: columnsResult.rows,
  //     };
  //   })
  // );
  // fs.writeFileSync('schema.json', JSON.stringify(schemaInfo, null, 2), 'utf8');
  // client.release();


  return new Response(JSON.stringify(response));
}

export const GET = handler

