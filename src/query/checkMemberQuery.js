import { useQuery } from "@tanstack/react-query";
import { checkMemberApi } from "../api/memberApi";

export const useCheckMemberQuery = () => {
    return useQuery({
        querykey: ['checkMember'],
        queryFn: checkMemberApi,
        retry: false, //재시도 않함
        refetchOnWindowFocus: true, // 다른 탭 갔다오면 다시 확인
        staleTime: 0 // 항상 최신 상태 확인


    })
}