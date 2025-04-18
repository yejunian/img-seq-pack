# img-seq-pack: Image Sequence Packer

## 사용 방법

1. 이미지 파일을 선택합니다. 파일을 브라우저 창으로 끌어와 선택할 수도 있습니다.
2. 원하는 대로 옵션을 변경합니다.
3. ‘변환하기’ 버튼을 누르면 옵션에 따라 단일 PDF 파일로 변환하는 과정이 진행됩니다. 변환이 완료되면 PDF 파일이 브라우저 설정에 따라 다운로드 폴더 또는 사용자 지정 폴더에 저장됩니다.

### 옵션 상세

* **출력물 제목**: 출력물의 기본 파일명을 지정합니다. (확장자 제외)
* **페이지 크기**: 각 페이지의 가로, 세로 크기를 지정합니다. (단위: pt, 72 DPI 기준)
    * **페이지보다 작은 이미지도 페이지 크기에 맞추기**
        * 끔: 페이지보다 작은 이미지를 원래 크기로 보여줍니다.
        * 켬: 페이지보다 작은 이미지를 페이지 크기에 맞춰 키웁니다.
* **JPEG 품질(%)**: JPEG을 사용 시 적용할 품질을 지정합니다. (0-100)
* **투명 영역 색상**: 투명(도) 지원 이미지 사용 시 배경으로 채울 색상을 지정합니다.
* **페이지 정렬**: ‘선택한 파일 목록’의 순서를 버리고 원본 파일명 순서대로 정렬합니다.
    * **자연스러운 정렬**: 운영체제 또는 브라우저 언어·지역 설정에 따라 더 자연스럽게 정렬합니다. 음이 아닌 정수 또한 자연스럽게 정렬합니다.
        * 켬: `img-1.png` → `img-1a.png` → `img-2.png` → `img-12.png`
        * 끔: `img-1.png` → `img-12.png` → `img-1a.png` → `img-2.png`
    * **파일명에서 확장자를 분리하여 정렬**: 확장자를 제외한 이름 순으로 먼저 정렬한 뒤, 이름이 같고 확장자만 다른 파일끼리 확장자 순으로 정렬합니다. 확장자 앞의 마침표로 인해 정렬 순서가 의도와 달라지는 것을 방지합니다.
        * 켬: `img.png` → `img.1.png`
        * 끔: `img.1.png` → `img.png`
* **페이지 번호**: 지정한 숫자부터 시작하여 1씩 증가하는 페이지 번호를 표시합니다. (0 이상)
* **페이지 설명**: 파일명을 페이지 설명으로 사용할 수 있습니다. 페이지 상단에 페이지 설명을 위한 공간이 추가됩니다.
    * **확장자 포함**: 확장자를 포함한 파일명을 사용합니다.
    * **파일명 텍스트 찾아 바꾸기**: 파일명에서 ‘찾을 내용’을 ‘바꿀 내용’으로 변경합니다. 이 기능은 현재 불완전합니다. 항상 대소문자를 구분하고, 파일명마다 발견된 첫 번째 텍스트만 치환합니다.
        * **정규 표현식 사용**: 단순 치환 대신 정규 표현식 치환을 사용합니다.

#### 이미지 처리 과정

1. 이미지를 불러와서 ‘페이지 크기’ 설정에 맞춰 줄입니다. 페이지 크기보다 작은 이미지는 원본 크기로 유지해 둡니다.
2. 중복 이미지 검사
    * 동일한 이미지가 있으면, 기존 이미지를 재사용하여 PDF 파일 크기를 줄입니다.
    * 동일한 이미지가 없으면, 이미지 배경을 ‘투명 영역 색상’ 설정으로 채우고 PNG와 JPEG으로 각각 변환한 것의 크기를 비교하여 더 나은 쪽을 선택합니다. PNG 이미지의 크기가 JPEG 이미지의 1.1배 이하면 PNG 이미지를, 아니면 JPEG 이미지를 사용합니다. 이 시점에 PDF에 렌더할 이미지 영역을 계산합니다.
3. PDF 문서의 새 페이지에 이미지를 첨부합니다. 이때 설정에 따라서 페이지 크기보다 작은 이미지를 페이지 크기에 맞출 수 있습니다.

---

## 개발 환경

* Node.js 18
* Yarn 1.22
* \[선택] `deploy` 스크립트를 실행하려면  Git >= 1.9가 필요합니다.

### 스크립트

* `pnpm dev`: 개발 서버를 실행합니다.
* `pnpm build`: 프로덕션 페이지를 빌드합니다.
* `pnpm preview`: 프로덕션 빌드를 확인하기 위한 로컬 서버를 실행합니다.
* `pnpm run deploy`: 프로덕션 빌드를 수행하고, 그 결과물을 복사하여 `gh-pages` 브랜치에 반영합니다.

### 이미지 처리 특이사항

* 외부 라이브러리: `browser-image-compression` 없이도 `HTMLCanvasElement`의 `toBlob()`, `toDataURL()` 메서드로 JPEG, PNG 이미지를 생성할 수 있습니다. 하지만 Canvas API만으로는 PNG 이미지가 더 가볍게 나올 만한 상황에서도 PNG 이미지가 더 무겁게 나오는 결과를 얻었기 때문에 해당 라이브러리를 사용했습니다.
* 배경색 채우기 vs 투명으로 두기: PNG 이미지를 생성한다 하더라도, 투명으로 둔 쪽보다 배경색을 채운 쪽이 더 가벼웠습니다. 최종 출력물이 PDF 문서이기도 해서, 모든 이미지에 배경색을 채우도록 했습니다.
