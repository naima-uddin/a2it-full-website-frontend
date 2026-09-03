import { SECTION_SCHEMAS } from "@/lib/serviceContent/registry";
import ServiceContentEditor from "./ServiceContentEditor";

// Required for `output: "export"` — emit one static page per editable section
// key. The keys are known statically from the registry, so no build-time API
// call is needed. The editor itself (client component) still loads/saves its
// data at runtime.
export function generateStaticParams() {
  return Object.keys(SECTION_SCHEMAS).map((key) => ({ key }));
}

export default function Page() {
  return <ServiceContentEditor />;
}
