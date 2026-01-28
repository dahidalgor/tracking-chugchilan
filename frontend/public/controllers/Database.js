// controllers/Database.js
import mysql from 'mysql2/promise';
import { dbConfig } from '../config/db.config.js';

class Database {
  constructor() {
    this.pool = mysql.createPool(dbConfig);
  }

  /**
   * Obtiene la conexión de la base de datos
   */
  async getConnection() {
    return await this.pool.getConnection();
  }

  /**
   * Ejecuta una consulta SQL
   */
  async query(sql, params = []) {
    let connection;
    try {
      connection = await this.getConnection();
      const [results] = await connection.execute(sql, params);
      return results;
    } catch (error) {
      console.error('Error en consulta SQL:', error);
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }

  /**
   * Obtiene todos los guías con sus traducciones para un idioma específico
   */
  async getGuides(language = 'es') {
    const sql = `
      SELECT 
        g.id,
        g.img_src,
        g.contacto,
        g.whatsapp,
        gi.nombre,
        gi.idiomas_habla
      FROM guias g
      INNER JOIN guias_i18n gi ON g.id = gi.guia_id
      WHERE gi.idioma = ?
      ORDER BY g.id
    `;
    return await this.query(sql, [language]);
  }

  /**
   * Obtiene todas las actividades con sus traducciones para un idioma específico
   */
  async getActivities(language = 'es') {
    const sql = `
      SELECT 
        a.id,
        a.img_src,
        ai.titulo,
        ai.descripcion,
        ai.horario,
        ai.alt
      FROM actividades a
      INNER JOIN actividades_i18n ai ON a.id = ai.actividad_id
      WHERE ai.idioma = ?
      ORDER BY a.id
    `;
    return await this.query(sql, [language]);
  }

  /**
   * Obtiene todos los hospedajes con sus traducciones para un idioma específico
   */
  async getLodgings(language = 'es') {
    const sql = `
      SELECT 
        h.id,
        h.img_src,
        h.telefono,
        h.url,
        h.ubicacion,
        hi.titulo,
        hi.descripcion,
        hi.horario,
        hi.alt
      FROM hospedajes h
      INNER JOIN hospedajes_i18n hi ON h.id = hi.hospedaje_id
      WHERE hi.idioma = ?
      ORDER BY h.id
    `;
    return await this.query(sql, [language]);
  }

  /**
   * Obtiene un guía específico por ID e idioma
   */
  async getGuideById(id, language = 'es') {
    const sql = `
      SELECT 
        g.id,
        g.img_src,
        g.contacto,
        g.whatsapp,
        gi.nombre,
        gi.idiomas_habla
      FROM guias g
      INNER JOIN guias_i18n gi ON g.id = gi.guia_id
      WHERE g.id = ? AND gi.idioma = ?
    `;
    const results = await this.query(sql, [id, language]);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Obtiene todas las traducciones disponibles para un guía
   */
  async getGuideTranslations(guideId) {
    const sql = `
      SELECT gi.idioma, gi.nombre, gi.idiomas_habla
      FROM guias_i18n gi
      WHERE gi.guia_id = ?
    `;
    return await this.query(sql, [guideId]);
  }

  /**
   * Cierra la conexión a la base de datos
   */
  async close() {
    await this.pool.end();
  }
}

export default Database;