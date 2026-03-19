import { useQuery } from "@tanstack/react-query"
import { noticeListApi} from "../api/boardApi"


export const useNoticeListQuery = (page = 1) => {

    return useQuery({
        queryKey: ['noticeList', page],
        queryFn: () => noticeListApi(page),
        staleTime: 30000, //30초간 유지
        retry: 1
    })
}