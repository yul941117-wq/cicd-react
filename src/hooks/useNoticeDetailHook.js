import { useNavigate, useParams } from "react-router-dom"
import { useNoticeDetailQuery} from "../query/NoticeDetailQuery"
import useUserStore from "../store/userStore";
import { useState } from "react";
import { useNoticeDeleteMutation } from "../query/useNoticeDeleteMutation";

export const useNoticeDetailHook = () => {
    const[showDeleteModal, setShewDeleteModal] = useState(false);
    const noticeDeleteMutation = useNoticeDeleteMutation();

    //경로파라미터 가져오기
    const  {id} = useParams();
    const navigate = useNavigate();
    const postId= id ? parseInt(id) : null;

    // 공지사항 게시글 상세보기 조회
    const { data, isLoading, isError, error} = useNoticeDetailQuery(postId);

    //로그인한 사용자 상태 가져오기
    const { currentUser} = useUserStore();

    //로그인한 유저와 작성자가 일치하는지 확인
    const isWriterCheck = () => {
        if(data.writerName === currentUser.userName) {
            return true;
        }

        return false;
    }

    //목록으로 돌아가기
    const goToList = () => {
        navigate('/notice/list')
    }

    //수정 페이지로 이동
    const goToEdit = () => {
        if(postId) navigate(`/notice/edit/${postId}`)
    }
    
    
    //삭제 모달 열기
    const deletePost = () => {
        setShewDeleteModal(true);
    }

    //모달 닫기
    const closeDeleteModal = ()=> {
        setShewDeleteModal(false);    
    }

    //게시글 삭제
    const confirmDelete= () =>{
        //TODO: 삭제 Query 연동 예정
        //  -query/NoticeDeleteMutation
        //      >함수명: useNoticeDeleteMutation
        //  -전달 시 postId 주기
        //  -api/boardApi.js
        //      >함수명 : noticeDeleteApi
        //      >URI : /api/board/notice/{postId}
        //      >Method : DELETE

        noticeDeleteMutation.mutate(postId);

        alert("게시글이 삭제되었습니다.");
        closeDeleteModal();
        goToList(); //리스트 페이지로 이동
    }

    return {data,
            postId,
            isLoading,
            isError,
            error,
            isWriterCheck,
            currentUser,
            goToList,
            goToEdit,
            deletePost,
            closeDeleteModal,
            confirmDelete,
            showDeleteModal}
    }
