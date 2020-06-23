<div class="col-xl-3 col-md-6" id="%DIVID%">
            <div class="card mb-4">
                <div class="card-header">
                    <h2 class="mb-0">
                        <button class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapse%ITEM%">
                            <i id="icon2" class="fa fa-plus"></i>%NAME%</button>
                    </h2>
                </div>
                <div id="collapse%ITEM%" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
                    <div class="card-body bg-light" style="color: black">
                        <div class="row">
                            <div class="col-sm-12" style="background-color: #e9ecef">Pub key:</div>
                        </div>
                        <div class="row">
                            <div class="col-sm-12">%PKEY%</div>
                        </div>
                        <div class="row">
                            <div class="col-sm-12" style="background-color: #e9ecef">Creation date:</div>
                        </div>
                        <div class="row">
                            <div class="col-sm-12">%CDATE%</div>
                        </div>
                        <div class="row">
                            <div class="col-sm-12" style="background-color: #e9ecef">Last seen:</div>
                        </div>
                        <div class="row">
                            <div class="col-sm-12">%LSEEN%</div>
                        </div>
                        <div class="row">
                            <div class="col-sm-6" style="background-color: #e9ecef">RX</div>
                            <div class="col-sm-6" style="background-color: #e9ecef">TX</div>
                        </div>
                        <div class="row">
                            <div class="col-sm-6">%RX%</div>
                            <div class="col-sm-6">%TX%</div>
                        </div>
                    </div>
                    <div class="card-footer d-flex align-items-center justify-content-between">
			<button type="button" data-toggle="modal" data-target="#exportWindow" data-whatever="%NAME%" class="btn btn-primary">Export</button>
		    </div>
		</div>
            </div>
        </div>
