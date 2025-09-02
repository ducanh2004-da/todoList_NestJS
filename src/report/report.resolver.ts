import { ReportResponse } from 'src/models/reportResponse.dto';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { ReportService } from './report.service';

@Resolver(() => ReportResponse)
export class ReportResolver {
    constructor(private reportService: ReportService){}

    @Query(() => ReportResponse, {name: 'report'})
    async showReport(){
        return this.reportService.showReport();
    }
}
