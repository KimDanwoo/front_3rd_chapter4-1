import Image from 'next/image'
import { Noto_Sans_KR } from 'next/font/google'

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
})

export default function Home() {
  return (
    <main className={`min-h-screen p-8 max-w-6xl mx-auto ${notoSansKr.className}`}>
      <section className="relative h-[400px] rounded-xl overflow-hidden mb-12">
        <Image
          src="https://picsum.photos/1600/400"
          width={1600}
          height={400}
          alt="Hero image"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
          <h1 className="text-5xl font-bold text-white mb-4">성능 테스트 페이지</h1>
          <p className="text-xl text-white/90">S3와 CloudFront 성능 비교를 위한 페이지입니다</p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-sm text-gray-500 mb-2">통계 {i + 1}</div>
            <div className="text-3xl font-bold mb-2">{Math.floor(Math.random() * 1000)}</div>
            <div className="text-sm text-green-500">+{Math.floor(Math.random() * 100)}%</div>
          </div>
        ))}
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">이미지 갤러리</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="relative aspect-video rounded-lg overflow-hidden group">
              <Image
                src={`https://picsum.photos/400/300?random=${i}`}
                width={400}
                height={300}
                alt={`Gallery image ${i + 1}`}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-medium">이미지 {i + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6 text-gray-800">
          <h2 className="text-2xl font-bold mb-6">서비스 소개</h2>
          <div className="prose max-w-none">
            <p className="mb-4">
              이 페이지는 Next.js 애플리케이션의 성능을 테스트하기 위해 제작되었습니다. 다양한 리소스(이미지, 폰트,
              스크립트 등)를 포함하고 있어 S3 직접 호스팅과 CloudFront를 통한 배포의 성능 차이를 비교하기에 적합합니다.
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>대형 이미지 로딩</li>
              <li>다수의 이미지 동시 로딩</li>
              <li>CSS 트랜지션 및 애니메이션</li>
              <li>반응형 그리드 레이아웃</li>
              <li>웹폰트 적용</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-gray-800">
          <h2 className="text-2xl font-bold mb-6">주요 기능</h2>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-4">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-semibold">기능 {i + 1}</h3>
                  <p className="text-sm text-gray-500">기능 {i + 1}에 대한 상세 설명이 들어갑니다.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
