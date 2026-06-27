/**
 * Import script: Excel → Supabase car_specs table
 *
 * Usage:
 *   node scripts/import-car-specs.js path/to/IndiaCarDatabase.xlsx
 *
 * Requires:
 *   npm install xlsx @supabase/supabase-js dotenv
 *
 * Set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env (use the service_role key,
 * NOT the anon key, so it can bypass RLS for writes).
 *
 * This script does a full replace: truncates car_specs then re-inserts all rows.
 * Safe to re-run any time you receive a new version of the Excel file.
 */

import XLSX from 'xlsx';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { config } from 'dotenv';
import { resolve } from 'path';

config();

const SUPABASE_URL        = process.env.SUPABASE_URL        || 'https://tozzhpyvromigzhtzlvc.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌  Set SUPABASE_SERVICE_KEY in .env (use the service_role key, not the anon key)');
  process.exit(1);
}

const xlsxPath = process.argv[2];
if (!xlsxPath) {
  console.error('❌  Usage: node scripts/import-car-specs.js path/to/IndiaCarDatabase.xlsx');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Column index → DB field name (1-based, matching Teoalida Excel layout)
// Row 3 = human headers, Row 4 = field keys, data starts at Row 15
const COL_MAP = {
  2:   'version_id',
  3:   'source_url',
  4:   'make',
  5:   'model',
  6:   'version',
  7:   'body_style',
  8:   'status_notes',
  9:   'image_url',
  10:  'ex_showroom_price',
  11:  'onroad_price_delhi',
  12:  'key_price',
  13:  'key_mileage_arai',
  14:  'key_engine',
  15:  'key_transmission',
  16:  'key_fuel_type',
  17:  'key_seating_capacity',
  18:  'engine_detail',
  19:  'engine_type',
  20:  'top_speed',
  21:  'acceleration_0_100',
  22:  'fuel_type',
  23:  'max_power',
  24:  'max_power_rpm',
  25:  'max_torque',
  26:  'max_torque_rpm',
  27:  'perf_alternate_fuel',
  28:  'max_engine_perf',
  29:  'max_motor_perf',
  30:  'mileage_arai',
  32:  'driving_range',
  33:  'drivetrain',
  34:  'transmission',
  35:  'emission_standard',
  36:  'turbocharger',
  37:  'battery',
  38:  'battery_charging',
  39:  'electric_motor',
  40:  'engine_others',
  41:  'alternate_fuel',
  42:  'length_mm',
  43:  'width_mm',
  44:  'height_mm',
  45:  'wheelbase_mm',
  46:  'ground_clearance',
  47:  'kerb_weight',
  48:  'doors',
  49:  'seating_capacity',
  50:  'seating_rows',
  51:  'bootspace',
  52:  'fuel_tank_capacity',
  53:  'front_suspension',
  54:  'rear_suspension',
  55:  'front_brake_type',
  56:  'rear_brake_type',
  57:  'min_turning_radius',
  58:  'steering_type',
  59:  'wheels',
  60:  'spare_wheel',
  61:  'front_tyres',
  62:  'rear_tyres',
  63:  'four_wheel_steering',
  65:  'overspeed_warning',
  66:  'lane_departure_warning',
  67:  'emergency_brake_light',
  68:  'forward_collision_warning',
  69:  'auto_emergency_braking',
  70:  'high_beam_assist',
  71:  'ncap_rating',
  72:  'blind_spot_detection',
  73:  'lane_departure_prevention',
  74:  'puncture_repair_kit',
  75:  'rear_cross_traffic_assist',
  76:  'airbags',
  77:  'middle_rear_seatbelt',
  78:  'middle_rear_headrest',
  79:  'tpms',
  80:  'child_seat_anchors',
  81:  'seatbelt_warning',
  82:  'abs',
  83:  'ebd',
  84:  'brake_assist',
  85:  'esp',
  86:  'four_wheel_drive',
  87:  'hill_hold_control',
  88:  'traction_control',
  89:  'ride_height_adjustment',
  90:  'hill_descent_control',
  91:  'lsd',
  92:  'differential_lock',
  93:  'engine_immobilizer',
  94:  'central_locking',
  95:  'speed_sensing_doorlock',
  96:  'child_safety_lock',
  97:  'air_conditioner',
  98:  'front_ac',
  99:  'rear_ac',
  100: 'headlight_ignition_reminder',
  101: 'keyless_start',
  102: 'steering_adjustment',
  103: 'power_outlets_12v',
  104: 'cruise_control',
  105: 'parking_sensors',
  106: 'parking_assist',
  110: 'cabin_boot_access',
  111: 'third_row_ac',
  112: 'remote_light_honk',
  113: 'geofence',
  114: 'remote_sunroof',
  115: 'ota_updates',
  116: 'vehicle_status_app',
  117: 'remote_lock_unlock',
  118: 'emergency_call',
  119: 'find_my_car',
  120: 'remote_ac',
  121: 'alexa_compatibility',
  122: 'driver_seat_adjustment',
  123: 'front_passenger_seat_adj',
  124: 'rear_seat_adjustment',
  125: 'third_row_seat_adjustment',
  126: 'seat_upholstery',
  127: 'leather_steering_wheel',
  128: 'leather_gear_knob',
  129: 'driver_armrest',
  130: 'rear_passenger_seats_type',
  131: 'third_row_seats_type',
  132: 'ventilated_seats',
  133: 'ventilated_seat_type',
  134: 'interiors',
  135: 'interior_colours',
  136: 'rear_armrest',
  137: 'folding_rear_seat',
  138: 'split_rear_seat',
  139: 'split_third_row_seat',
  140: 'front_seatback_pockets',
  141: 'headrests',
  142: 'fourth_row_seat_adjustment',
  143: 'cup_holders',
  144: 'driver_armrest_storage',
  145: 'cooled_glove_box',
  146: 'sunglass_holder',
  147: 'third_row_cup_holders',
  148: 'one_touch_down',
  149: 'one_touch_up',
  150: 'power_windows',
  151: 'adjustable_orvm',
  152: 'turn_indicators_orvm',
  153: 'rear_defogger',
  154: 'rear_wiper',
  155: 'exterior_door_handles',
  156: 'rain_sensing_wipers',
  157: 'interior_door_handles',
  158: 'door_pockets',
  159: 'side_window_blinds',
  160: 'bootlid_opener',
  161: 'rear_windshield_blind',
  163: 'scuff_plates',
  164: 'sunroof',
  166: 'roof_antenna',
  167: 'body_coloured_bumpers',
  168: 'chrome_exhaust',
  169: 'body_kit',
  170: 'rub_strips',
  171: 'fog_lights',
  172: 'daytime_running_lights',
  173: 'headlights',
  174: 'auto_headlamps',
  175: 'follow_me_home',
  176: 'tail_lights',
  177: 'cabin_lamps',
  178: 'headlight_height_adjuster',
  179: 'glove_box_lamp',
  180: 'vanity_mirror_lights',
  181: 'rear_reading_lamp',
  182: 'cornering_headlights',
  183: 'puddle_lamps',
  184: 'ambient_lighting',
  185: 'instrument_cluster',
  186: 'trip_meter',
  187: 'avg_fuel_consumption',
  188: 'average_speed',
  189: 'distance_to_empty',
  190: 'clock',
  191: 'low_fuel_warning',
  192: 'door_ajar_warning',
  193: 'adjustable_cluster_brightness',
  194: 'gear_indicator',
  195: 'shift_indicator',
  196: 'hud',
  197: 'tachometer',
  198: 'instantaneous_consumption',
  199: 'smart_connectivity',
  200: 'music_system',
  201: 'head_unit_size',
  202: 'display',
  203: 'rear_display',
  204: 'gps_navigation',
  205: 'speakers',
  206: 'usb',
  207: 'aux',
  208: 'bluetooth',
  210: 'cd_player',
  211: 'dvd_playback',
  212: 'am_fm_radio',
  213: 'ipod_compatibility',
  214: 'internal_hard_drive',
  215: 'steering_controls',
  216: 'voice_command',
  217: 'wireless_charger',
  218: 'gesture_control',
  221: 'warranty_years',
  222: 'warranty_km',
  223: 'battery_warranty_years',
  224: 'battery_warranty_km',
  225: 'color_name',
  226: 'color_rgb',
  227: 'price_ex_showroom',
  228: 'price_rto',
  229: 'price_insurance',
  230: 'price_tcs',
  231: 'price_handling',
  232: 'price_fasttag',
  233: 'onroad_mumbai',
  234: 'onroad_bangalore',
  235: 'onroad_delhi',
  236: 'onroad_pune',
  237: 'onroad_navi_mumbai',
  238: 'onroad_hyderabad',
  239: 'onroad_ahmedabad',
  240: 'onroad_chennai',
  241: 'onroad_kolkata',
  242: 'description',
};

function cellVal(sheet, row, col) {
  const addr = XLSX.utils.encode_cell({ r: row - 1, c: col - 1 });
  const cell = sheet[addr];
  if (!cell) return null;
  const v = cell.v;
  if (v === null || v === undefined || v === '') return null;
  return String(v).trim() || null;
}

function numVal(sheet, row, col) {
  const addr = XLSX.utils.encode_cell({ r: row - 1, c: col - 1 });
  const cell = sheet[addr];
  if (!cell) return null;
  const v = parseFloat(cell.v);
  return isNaN(v) ? null : v;
}

async function main() {
  console.log(`\n📂  Reading: ${xlsxPath}`);
  const workbook = XLSX.readFile(resolve(xlsxPath));
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const range = XLSX.utils.decode_range(sheet['!ref']);
  const maxRow = range.e.r + 1; // 1-based

  const DATA_START_ROW = 15;
  const rows = [];

  for (let r = DATA_START_ROW; r <= maxRow; r++) {
    const make = cellVal(sheet, r, 4);
    if (!make) break; // end of data

    const row = {};
    for (const [col, field] of Object.entries(COL_MAP)) {
      const c = parseInt(col);
      if (field === 'top_speed' || field === 'acceleration_0_100') {
        row[field] = numVal(sheet, r, c);
      } else if (field === 'version_id') {
        const v = numVal(sheet, r, c);
        row[field] = v ? Math.round(v) : null;
      } else {
        row[field] = cellVal(sheet, r, c);
      }
    }

    if (!row.version_id) {
      console.warn(`  ⚠️  Row ${r}: no version_id, skipping`);
      continue;
    }
    rows.push(row);
  }

  console.log(`✅  Parsed ${rows.length} rows`);

  // Full replace: truncate then insert in batches of 500
  console.log('🗑️   Truncating car_specs…');
  const { error: truncErr } = await supabase.rpc('truncate_car_specs');
  if (truncErr) {
    // Fallback: delete all rows (works without a stored proc)
    const { error: delErr } = await supabase.from('car_specs').delete().gte('version_id', 0);
    if (delErr) { console.error('❌  Delete failed:', delErr.message); process.exit(1); }
  }

  const BATCH = 500;
  let inserted = 0;
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);
    const { error } = await supabase.from('car_specs').upsert(batch, { onConflict: 'version_id' });
    if (error) { console.error(`❌  Upsert failed at row ${i}:`, error.message); process.exit(1); }
    inserted += batch.length;
    process.stdout.write(`\r⬆️   Inserted ${inserted}/${rows.length}…`);
  }

  console.log(`\n🎉  Done — ${inserted} records in car_specs`);
}

main().catch(e => { console.error('❌ ', e.message); process.exit(1); });
