import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get("health")
  health(): { readonly status: "ok" } {
    return { status: "ok" };
  }
}
