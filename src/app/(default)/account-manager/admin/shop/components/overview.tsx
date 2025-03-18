"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Props {
	data: { name: string; total: number }[];
}

export function Overview({ data }: Props) {
	const CustomTooltip = ({
		active,
		payload,
		label,
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	}: { active: boolean; payload: any[]; label: string }) => {
		if (active && payload && payload.length) {
			return (
				<div className="rounded-sm border bg-background/80 p-2">
					<p className="font-medium text-xs">
						Total:{" "}
						{payload[0].value.toLocaleString(undefined, {
							style: "currency",
							currency: "USD",
							currencyDisplay: "narrowSymbol",
						})}
					</p>
				</div>
			);
		}

		return null;
	};

	return (
		<ResponsiveContainer width="100%" height={250}>
			<BarChart
				data={data}
				margin={{
					top: 0,
					right: 0,
					left: 0,
					bottom: 0,
				}}
				barCategoryGap={5}
				barGap={0}
				width={150}
			>
				<CartesianGrid stroke="#ffffffa5" strokeDasharray="3 3" />
				<XAxis dataKey="name" stroke="#fff" fontSize={12} tickLine={false} axisLine={false} />
				<YAxis
					dataKey="total"
					stroke="#fff"
					fontSize={12}
					tickLine={false}
					axisLine={false}
					tickFormatter={(value) => `$${value}`}
				/>
				<Tooltip
					content={<CustomTooltip active={false} payload={[]} label={""} />}
					separator="#000"
				/>
				<Bar dataKey="total" fill="#82ca9d" radius={[4, 4, 0, 0]} />
			</BarChart>

			{/*
      <AreaChart
        data={data}
        margin={{
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <Tooltip content={<CustomTooltip active={false} payload={[]} label={""} />} separator="#000" />
        <Area type="monotone" dataKey="total" stroke="#82ca9d" fill="#82ca9d" />
      </AreaChart>
      */}
		</ResponsiveContainer>
	);
}
