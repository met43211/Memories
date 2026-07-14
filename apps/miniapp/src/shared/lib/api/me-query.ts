import { queryOptions } from "@tanstack/react-query";
import { api } from "../api";

export function meQuery() {
	return queryOptions({
		queryKey: ["me"],
		queryFn: async () => {
			const { data, error } = await api.me.get();
			if (error) throw error;
			return data;
		},
		staleTime: Number.POSITIVE_INFINITY,
		retry: false,
	});
}
