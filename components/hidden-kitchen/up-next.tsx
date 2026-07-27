import { TonightOnStage } from './tonight-on-stage'

export function UpNext() {
  return (
    <>
      <style>{`
        .up-next-container {
          padding: 5px 4vw 10px 4vw !important;
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          overflow: visible !important;
          height: auto !important;
          max-height: none !important;
        }
      `}</style>
      <section className="up-next-container w-full">
        <div className="mx-auto w-full overflow-visible flex justify-center">
          <TonightOnStage />
        </div>
      </section>
    </>
  )
}
