-- car_specs table: mirrors the Teoalida India Car Database structure
-- Run this once in Supabase SQL editor to create the table.
-- Re-run the import script any time you get a new version of the Excel.

create table if not exists car_specs (
  -- Identity
  version_id          integer primary key,
  source_url          text,

  -- Naming
  make                text not null,
  model               text not null,
  version             text,
  body_style          text,
  status_notes        text,
  image_url           text,
  ex_showroom_price   text,
  onroad_price_delhi  text,

  -- Key Data (summary)
  key_price           text,
  key_mileage_arai    text,
  key_engine          text,
  key_transmission    text,
  key_fuel_type       text,
  key_seating_capacity text,

  -- Engine & Transmission
  engine_detail       text,
  engine_type         text,
  top_speed           numeric,
  acceleration_0_100  numeric,
  fuel_type           text,
  max_power           text,
  max_power_rpm       text,
  max_torque          text,
  max_torque_rpm      text,
  perf_alternate_fuel text,
  max_engine_perf     text,
  max_motor_perf      text,
  mileage_arai        text,
  driving_range       text,
  drivetrain          text,
  transmission        text,
  emission_standard   text,
  turbocharger        text,
  battery             text,
  battery_charging    text,
  electric_motor      text,
  engine_others       text,
  alternate_fuel      text,

  -- Dimensions & Weight
  length_mm           text,
  width_mm            text,
  height_mm           text,
  wheelbase_mm        text,
  ground_clearance    text,
  kerb_weight         text,

  -- Capacity
  doors               text,
  seating_capacity    text,
  seating_rows        text,
  bootspace           text,
  fuel_tank_capacity  text,

  -- Suspension, Brakes, Steering & Tyres
  front_suspension    text,
  rear_suspension     text,
  front_brake_type    text,
  rear_brake_type     text,
  min_turning_radius  text,
  steering_type       text,
  wheels              text,
  spare_wheel         text,
  front_tyres         text,
  rear_tyres          text,
  four_wheel_steering text,

  -- Safety
  overspeed_warning           text,
  lane_departure_warning      text,
  emergency_brake_light       text,
  forward_collision_warning   text,
  auto_emergency_braking      text,
  high_beam_assist            text,
  ncap_rating                 text,
  blind_spot_detection        text,
  lane_departure_prevention   text,
  puncture_repair_kit         text,
  rear_cross_traffic_assist   text,
  airbags                     text,
  middle_rear_seatbelt        text,
  middle_rear_headrest        text,
  tpms                        text,
  child_seat_anchors          text,
  seatbelt_warning            text,

  -- Braking & Traction
  abs                         text,
  ebd                         text,
  brake_assist                text,
  esp                         text,
  four_wheel_drive            text,
  hill_hold_control           text,
  traction_control            text,
  ride_height_adjustment      text,
  hill_descent_control        text,
  lsd                         text,
  differential_lock           text,

  -- Locks & Security
  engine_immobilizer          text,
  central_locking             text,
  speed_sensing_doorlock      text,
  child_safety_lock           text,

  -- Comfort & Convenience
  air_conditioner             text,
  front_ac                    text,
  rear_ac                     text,
  headlight_ignition_reminder text,
  keyless_start               text,
  steering_adjustment         text,
  power_outlets_12v           text,
  cruise_control              text,
  parking_sensors             text,
  parking_assist              text,
  cabin_boot_access           text,
  third_row_ac                text,

  -- Telematics
  remote_light_honk           text,
  geofence                    text,
  remote_sunroof              text,
  ota_updates                 text,
  vehicle_status_app          text,
  remote_lock_unlock          text,
  emergency_call              text,
  find_my_car                 text,
  remote_ac                   text,
  alexa_compatibility         text,

  -- Seats & Upholstery
  driver_seat_adjustment      text,
  front_passenger_seat_adj    text,
  rear_seat_adjustment        text,
  third_row_seat_adjustment   text,
  seat_upholstery             text,
  leather_steering_wheel      text,
  leather_gear_knob           text,
  driver_armrest              text,
  rear_passenger_seats_type   text,
  third_row_seats_type        text,
  ventilated_seats            text,
  ventilated_seat_type        text,
  interiors                   text,
  interior_colours            text,
  rear_armrest                text,
  folding_rear_seat           text,
  split_rear_seat             text,
  split_third_row_seat        text,
  front_seatback_pockets      text,
  headrests                   text,
  fourth_row_seat_adjustment  text,

  -- Storage
  cup_holders                 text,
  driver_armrest_storage      text,
  cooled_glove_box            text,
  sunglass_holder             text,
  third_row_cup_holders       text,

  -- Doors, Windows, Mirrors, Wipers
  one_touch_down              text,
  one_touch_up                text,
  power_windows               text,
  adjustable_orvm             text,
  turn_indicators_orvm        text,
  rear_defogger               text,
  rear_wiper                  text,
  exterior_door_handles       text,
  rain_sensing_wipers         text,
  interior_door_handles       text,
  door_pockets                text,
  side_window_blinds          text,
  bootlid_opener              text,
  rear_windshield_blind       text,
  scuff_plates                text,

  -- Exterior
  sunroof                     text,
  roof_antenna                text,
  body_coloured_bumpers       text,
  chrome_exhaust              text,
  body_kit                    text,
  rub_strips                  text,

  -- Lighting
  fog_lights                  text,
  daytime_running_lights      text,
  headlights                  text,
  auto_headlamps              text,
  follow_me_home              text,
  tail_lights                 text,
  cabin_lamps                 text,
  headlight_height_adjuster   text,
  glove_box_lamp              text,
  vanity_mirror_lights        text,
  rear_reading_lamp           text,
  cornering_headlights        text,
  puddle_lamps                text,
  ambient_lighting            text,

  -- Instrumentation
  instrument_cluster          text,
  trip_meter                  text,
  avg_fuel_consumption        text,
  average_speed               text,
  distance_to_empty           text,
  clock                       text,
  low_fuel_warning            text,
  door_ajar_warning           text,
  adjustable_cluster_brightness text,
  gear_indicator              text,
  shift_indicator             text,
  hud                         text,
  tachometer                  text,
  instantaneous_consumption   text,

  -- Entertainment
  smart_connectivity          text,
  music_system                text,
  head_unit_size              text,
  display                     text,
  rear_display                text,
  gps_navigation              text,
  speakers                    text,
  usb                         text,
  aux                         text,
  bluetooth                   text,
  cd_player                   text,
  dvd_playback                text,
  am_fm_radio                 text,
  ipod_compatibility          text,
  internal_hard_drive         text,
  steering_controls           text,
  voice_command               text,
  wireless_charger            text,
  gesture_control             text,

  -- Warranty
  warranty_years              text,
  warranty_km                 text,
  battery_warranty_years      text,
  battery_warranty_km         text,

  -- Colors
  color_name                  text,
  color_rgb                   text,

  -- Price Breakdown
  price_ex_showroom           text,
  price_rto                   text,
  price_insurance             text,
  price_tcs                   text,
  price_handling              text,
  price_fasttag               text,

  -- On-road prices by city
  onroad_mumbai               text,
  onroad_bangalore            text,
  onroad_delhi                text,
  onroad_pune                 text,
  onroad_navi_mumbai          text,
  onroad_hyderabad            text,
  onroad_ahmedabad            text,
  onroad_chennai              text,
  onroad_kolkata              text,

  -- Description
  description                 text,

  -- Metadata
  imported_at                 timestamptz default now()
);

-- Indexes for fast dropdown queries
create index if not exists idx_car_specs_make        on car_specs(make);
create index if not exists idx_car_specs_make_model  on car_specs(make, model);

-- Allow public read (admin writes via service key in import script)
alter table car_specs enable row level security;
create policy "Public read car_specs" on car_specs for select using (true);
