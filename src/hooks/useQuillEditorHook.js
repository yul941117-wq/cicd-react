import { useEffect, useRef, useState } from "react"

export const useQuillEditorHook = () => {
    const [editorReady, setEditorReady] = useState(false)

    // useRef()
    // - DOM에 접근하고 값을 수정할 수 있는 리액트 훅
    // - 렌더링 발생 x
    const editorInitializedRef = useRef(false)
    const quillRef = useRef(null);

    // Quill 에디터 초기화
    useEffect(() => {
        let timeoutId = null;
        let retryCount = 0;
        const maxRetries = 50; // 최대 5초 대기 (100ms * 50)

        const initEditor = () => {
            // Quill이 로드되지 않았으면 재시도
            if (typeof window === 'undefined' || !window.Quill) {
                if (retryCount < maxRetries) {
                    retryCount++;
                    timeoutId = setTimeout(initEditor, 100);
                } else {
                    console.error('[NoticeEdit] Quill을 로드할 수 없습니다.');
                }
                return;
            }

            const editorElement = document.getElementById('noticeEditor');
            if (!editorElement) {
                // DOM 요소가 아직 준비되지 않았으면 재시도
                if (retryCount < maxRetries) {
                    retryCount++;
                    timeoutId = setTimeout(initEditor, 100);
                }
                return;
            }

            // 이미 초기화되었으면 스킵
            if (editorInitializedRef.current || quillRef.current) {
                return;
            }

            try {
                const quill = new window.Quill('#noticeEditor', {
                    theme: 'snow',
                    placeholder: '공지사항 내용을 입력하세요',
                    modules: {
                        toolbar: [
                            [{ 'header': [1, 2, 3, false] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            ['blockquote', 'code-block'],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                            ['link', 'image'],
                            ['clean']
                        ]
                    }
                });

                quillRef.current = quill;
                editorInitializedRef.current = true;
                setEditorReady(true); // state 업데이트로 리렌더링 트리거

                // 에디터가 편집 가능한지 확인
                quill.enable(true);

                console.log('[NoticeEdit] Quill 에디터 초기화 완료');
            } catch (err) {
                console.error('[NoticeEdit] Quill 에디터 초기화 실패:', err);
            }
        };

        initEditor();

        // cleanup 함수
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, []); // 컴포넌트 마운트 시 한 번만 실행

    return {quillRef};
}