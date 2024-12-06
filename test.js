// import { Driver, Session } from 'neo4j-driver';
import neo4j from 'neo4j-driver';

const driver = neo4j.driver('neo4j+s://demo.neo4jlabs.com', neo4j.auth.basic('movies', 'movies'));

// console.log(driver);
async function query(cypher, params = {}) {
  const session = driver.session();
  try {
    const result = await session.run(cypher, params);
    return result.records.map(record => record.toObject());
  } catch (error) {
    console.error('Query failed:', error);
    throw error;
  } finally {
    await session.close();
  }
}


const result = await query('MATCH (m:Movie) RETURN m LIMIT 2');
console.log(JSON.stringify(result, null, 2));