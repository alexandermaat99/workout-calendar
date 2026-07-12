CREATE TABLE public.activity_types (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  activity text,
  CONSTRAINT activity_types_pkey PRIMARY KEY (id)
);

CREATE TABLE public.distance_measurements (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  measurement text,
  conversion_ratio numeric,
  CONSTRAINT distance_measurements_pkey PRIMARY KEY (id)
);

CREATE TABLE public.goals (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text,
  goal_date date,
  CONSTRAINT goals_pkey PRIMARY KEY (id)
);

CREATE TABLE public.equipment_types (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  equipment_type text,
  activity_type bigint,
  CONSTRAINT equipment_types_pkey PRIMARY KEY (id),
  CONSTRAINT equipment_type_activity_type_fkey FOREIGN KEY (activity_type) REFERENCES public.activity_types(id)
);

CREATE TABLE public.distance_activity_link (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  activity bigint,
  distance bigint,
  CONSTRAINT distance_activity_link_pkey PRIMARY KEY (id),
  CONSTRAINT distance_activity_link_activity_fkey FOREIGN KEY (activity) REFERENCES public.activity_types(id),
  CONSTRAINT distance_activity_link_distance_fkey FOREIGN KEY (distance) REFERENCES public.distance_measurements(id)
);

CREATE TABLE public.goal_distance_activity_link (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  goal bigint,
  activity bigint,
  distance_measurement bigint,
  goal_distance numeric,
  CONSTRAINT goal_distance_activity_link_pkey PRIMARY KEY (id),
  CONSTRAINT goal_distance_activity_link_goal_fkey FOREIGN KEY (goal) REFERENCES public.goals(id),
  CONSTRAINT goal_distance_activity_link_activity_fkey FOREIGN KEY (activity) REFERENCES public.activity_types(id),
  CONSTRAINT goal_distance_activity_link_distance_measurement_fkey FOREIGN KEY (distance_measurement) REFERENCES public.distance_measurements(id)
);

CREATE TABLE public.equipment (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text,
  odometer numeric,
  equipment_type bigint,
  CONSTRAINT equipment_pkey PRIMARY KEY (id),
  CONSTRAINT equipment_equipment_type_fkey FOREIGN KEY (equipment_type) REFERENCES public.equipment_types(id)
);